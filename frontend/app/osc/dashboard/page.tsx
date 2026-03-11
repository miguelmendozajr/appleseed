'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis, Cell } from 'recharts';

interface Lawyer {
  id: number;
  nombre: string;
  especialidad: string;
  telefono: string;
}

interface OSCData {
  rfc: string;
  nombre: string;
  logo?: string;
}

interface Donor {
  rfc: string;
  nombre: string;
  tipo_persona: string;
  codigo_postal_fiscal: string;
  regimen_fiscal: string;
  calle: string;
  numero_exterior: string;
  colonia: string;
  municipio: string;
  estado: string;
  curp: string;
  identificacion: string;
  comprobante_domicilio: string;
  declaracion_beneficiario_controlador: string;
  acta_constitutiva: string;
  poderes_legales: string;
  correo_electronico: string;
  constancia_situacion_fiscal: string;
  telefono: string;
  donadoSeisMeses: number;
  alertas: string[];
}

interface Donation {
  ID: number;
  Fecha: string;
  Tipo: string;
  Monto: string;
  Valor_estimado: string;
  rfc_donantes: string;
  Necesita_CFDI: number;
  CFDI: string | null;
  Declaracion_Origen_Recursos: string;
  Carta_De_Donacion: string;
  Acreditacion_Propiedad: string;
  Acreditacion_Valir_Propiedad: string;
}

interface ChartData {
  month: string;
  total: number;
}

interface BubbleData {
  name: string;
  totalDonated: number;
  count: number;
  x: number;
  y: number;
  z: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [oscData, setOscData] = useState<OSCData | null>(null);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [donaciones, setDonaciones] = useState<Donation[]>([]);
  const [loadingDonaciones, setLoadingDonaciones] = useState(true);
  const [stats, setStats] = useState({
    montoTotal: 0,
    cantidadDonaciones: 0,
    alertasPDL: 0
  });
  const [donantes, setDonantes] = useState<Donor[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [bubbleData, setBubbleData] = useState<BubbleData[]>([]);
  const [topDonor, setTopDonor] = useState<string | null>(null);
  
  // Modal states
  const [isDonorModalOpen, setIsDonorModalOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const storedData = localStorage.getItem('osc_data');
    if (!storedData) {
      router.push('/osc/login');
      return;
    }

    const parsedData = JSON.parse(storedData);
    setOscData(parsedData);

    // Fetch lawyers
    fetchLawyers();
    
    // Fetch donaciones con el RFC de la OSC
    fetchDonaciones(parsedData.rfc);
    // Fetch donantes para la OSC    
    fetchDonantes(parsedData.rfc);
  }, [router]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isDonorModalOpen || isDonationModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDonorModalOpen, isDonationModalOpen]);

  const fetchLawyers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/lawyers`);
      if (!response.ok) {
        throw new Error('Error al cargar abogados');
      }
      const data = await response.json();
      setLawyers(data);
    } catch (err) {
      setError('No se pudieron cargar los abogados');
      console.error('Error fetching lawyers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDonaciones = async (rfc: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/donations/osc?rfc=${rfc}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error al cargar donaciones');
      }

      const data = await response.json();
      setDonaciones(data);
      
      // Calcular estadísticas
      let total = 0;
      for (const donacion of data) {
        console.log(donacion.Tipo === 'especie' ? parseFloat(donacion.Valor_estimado) : parseFloat(donacion.Monto))
        total += donacion.Tipo === 'especie' ? parseFloat(donacion.Valor_estimado) : parseFloat(donacion.Monto);
      }
      
      setStats(prev => ({
        ...prev,
        montoTotal: total,
        cantidadDonaciones: data.length,
      }));

      // Procesar datos para la gráfica por mes
      const groupedByMonth = data.reduce((acc: Record<string, number>, donacion: Donation) => {
        const date = new Date(donacion.Fecha);
        const monthYear = date.toLocaleString('es-MX', { month: 'short', year: 'numeric' });
        
        if (!acc[monthYear]) {
          acc[monthYear] = 0;
        }
        
        const monto = donacion.Tipo === 'especie' ? parseFloat(donacion.Valor_estimado) : parseFloat(donacion.Monto);
        acc[monthYear] += monto;
        return acc;
      }, {});

      const chartDataArray: ChartData[] = Object.entries(groupedByMonth).map(([month, total]) => ({
        month,
        total: total as number
      }));

      setChartData(chartDataArray);

    } catch (err) {
      console.error('Error fetching donaciones:', err);
      setError('No se pudieron cargar las donaciones');
    } finally {
      setLoadingDonaciones(false);
    }
  };

  // Actualizar datos de burbujas cuando cambien donantes o donaciones
  useEffect(() => {
    if (donantes.length > 0 && donaciones.length > 0) {
      // Contar donaciones por donante
      const donationCountByRFC: Record<string, number> = {};
      donaciones.forEach(donacion => {
        donationCountByRFC[donacion.rfc_donantes] = (donationCountByRFC[donacion.rfc_donantes] || 0) + 1;
      });

      // Encontrar el donante con mayor donación
      let maxAmount = 0;
      let topDonorRFC = null;
      
      donantes.forEach(donante => {
        if (donante.donadoSeisMeses > maxAmount) {
          maxAmount = donante.donadoSeisMeses;
          topDonorRFC = donante.rfc;
        }
      });
      
      setTopDonor(topDonorRFC);
      
      // Crear datos para burbujas
      const maxAmountForScale = Math.max(...donantes.map(d => d.donadoSeisMeses));
      
      const bubbles: BubbleData[] = donantes.map((donante) => {
        const count = donationCountByRFC[donante.rfc] || 0;
        
        // Escalar el tamaño
        const minSize = 80;
        const maxSize = 200;
        const scaledSize = minSize + (donante.donadoSeisMeses / maxAmountForScale) * (maxSize - minSize);
        
        return {
          name: donante.rfc,
          totalDonated: donante.donadoSeisMeses,
          count: count,
          x: count,
          y: donante.donadoSeisMeses,
          z: scaledSize
        };
      });

      // Agrupar y ajustar posiciones para evitar superposición
      const donorsByCount = bubbles.reduce((acc, donor) => {
        if (!acc[donor.count]) {
          acc[donor.count] = [];
        }
        acc[donor.count].push(donor);
        return acc;
      }, {} as Record<number, BubbleData[]>);

      const adjustedBubbles = bubbles.map(donor => {
        const sameCountDonors = donorsByCount[donor.count] || [];
        if (sameCountDonors.length > 1) {
          const index = sameCountDonors.findIndex(d => d.name === donor.name);
          const offset = (index - (sameCountDonors.length - 1) / 2) * 0.15;
          return {
            ...donor,
            x: donor.count + offset
          };
        }
        return donor;
      });

      setBubbleData(adjustedBubbles);
    }
  }, [donantes, donaciones]);

  const fetchDonantes = async (rfc: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/osc/${rfc}/donors`);
      if (!response.ok) {
        throw new Error('Error al cargar donantes');
      }
      const data = await response.json();
      setDonantes(data);
      
      // Contar alertas PDL
      const pdlCount = data.reduce((count: number, donante: Donor) => {
        const pdlAlerts = donante.alertas?.filter(a => a.includes('PDL')).length || 0;
        return count + pdlAlerts;
      }, 0);
      
      setStats(prev => ({ ...prev, alertasPDL: pdlCount }));
    } catch (err) {
      console.error('Error fetching donantes:', err);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('osc_data');
    router.push('/');
  };

  const handleUploadCFDI = async (donationId: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/donations/${donationId}/cfdi`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Error al subir CFDI');
      }

      const data = await response.json();
      
      // Update the donaciones state with the new CFDI URL
      setDonaciones(prevDonaciones => 
        prevDonaciones.map((don: Donation) => 
          don.ID === donationId 
            ? { ...don, CFDI: data.url } 
            : don
        )
      );

      // Update the selected donation in the modal to show the new CFDI
      if (selectedDonation && selectedDonation.ID === donationId) {
        setSelectedDonation({ ...selectedDonation, CFDI: data.url });
      }

      alert('CFDI subido exitosamente');
    } catch (err) {
      console.error('Error uploading CFDI:', err);
      alert('Error al subir el CFDI. Por favor intenta de nuevo.');
    }
  };

  const triggerFileInput = (donationId: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.xml';
    input.style.display = 'none';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleUploadCFDI(donationId, file);
      }
      // Remove input after use
      document.body.removeChild(input);
    };
    
    // Cleanup if user cancels
    input.oncancel = () => {
      document.body.removeChild(input);
    };
    
    document.body.appendChild(input);
    input.click();
  };

  const openDonorModal = (donor: Donor) => {
    setSelectedDonor(donor);
    setIsDonorModalOpen(true);
  };

  const closeDonorModal = () => {
    setSelectedDonor(null);
    setIsDonorModalOpen(false);
  };

  const openDonationModal = (donation: Donation) => {
    setSelectedDonation(donation);
    setIsDonationModalOpen(true);
  };

  const closeDonationModal = () => {
    setSelectedDonation(null);
    setIsDonationModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <span className="text-3xl font-bold">
                <span className="text-[#4A6B6D]">Apple</span>
                <span className="text-[#8BC34A]">seed</span>
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{oscData?.nombre || 'Organización'}</p>
                <p className="text-xs text-gray-500">{oscData?.rfc}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Graphics Section - Placeholder */}
        <div className="mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#8BC34A]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Monto acumulado en donativos</p>
                  <p className="text-3xl font-bold text-gray-900">${stats.montoTotal.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#4A6B6D]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Cantidad de donativos</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.cantidadDonaciones}</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Alertas de auditoría</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.alertasPDL}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Placeholders */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Donaciones en los últimos 6 meses</h3>
              <div className="h-64">
                {loadingDonaciones ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-400">Cargando datos...</p>
                  </div>
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 70, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month"
                        label={{
                          value: 'Mes',
                          position: 'bottom',
                          offset: 20,
                          style: { fill: '#4a5568', fontSize: '12px', fontWeight: 500 }
                        }}
                        tick={{ fill: '#718096', fontSize: '11px' }}
                        tickLine={{ stroke: '#cbd5e0' }}
                        axisLine={{ stroke: '#cbd5e0' }}
                      />
                      <YAxis
                        label={{
                          value: 'Monto total ($)',
                          angle: -90,
                          position: 'left',
                          offset: 30,
                          style: { fill: '#4a5568', fontSize: '12px', fontWeight: 500, textAnchor: 'middle' }
                        }}
                        tickFormatter={(value) => {
                          if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
                          if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
                          return `$${value}`;
                        }}
                        tick={{ fill: '#718096', fontSize: '11px' }}
                        tickLine={{ stroke: '#cbd5e0' }}
                        axisLine={{ stroke: '#cbd5e0' }}
                      />
                      <Tooltip formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Monto']} />
                      <Bar dataKey="total" fill="#8BC34A" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-400">No hay datos disponibles</p>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Donante</h3>
              <div className="h-64">
                {loadingDonaciones ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-400">Cargando datos...</p>
                  </div>
                ) : bubbleData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 10, right: 30, bottom: 40, left: 80 }}>
                        <XAxis
                          type="number"
                          dataKey="x"
                          name="Número de donaciones"
                          label={{
                            value: 'Número de donaciones',
                            position: 'bottom',
                            offset: 20,
                            style: { fill: '#4a5568', fontSize: '12px', fontWeight: 500 }
                          }}
                          domain={[0.5, Math.max(...bubbleData.map(d => d.count), 1) + 0.5]}
                          ticks={[...new Set(bubbleData.map(d => d.count))].sort((a, b) => a - b)}
                          tick={{ fill: '#718096', fontSize: '11px' }}
                          tickLine={{ stroke: '#cbd5e0' }}
                          axisLine={{ stroke: '#cbd5e0' }}
                          allowDecimals={false}
                          interval={0}
                        />
                        <YAxis
                          type="number"
                          dataKey="y"
                          name="Monto total donado"
                          label={{
                            value: 'Monto total donado ($)',
                            angle: -90,
                            position: 'left',
                            offset: 30,
                            style: { fill: '#4a5568', fontSize: '12px', fontWeight: 500, textAnchor: 'middle' }
                          }}
                          tickFormatter={(value) => {
                            if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
                            if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
                            return `$${value}`;
                          }}
                          domain={[0, 'dataMax + 500']}
                          tick={{ fill: '#718096', fontSize: '11px' }}
                          tickLine={{ stroke: '#cbd5e0' }}
                          axisLine={{ stroke: '#cbd5e0' }}
                        />
                        <ZAxis type="number" dataKey="z" range={[60, 200]} />
                        <Tooltip
                          content={(props: unknown) => {
                            const { active, payload } = props as { active?: boolean; payload?: Array<{ payload: BubbleData }> };
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              const isTopDonor = data.name === topDonor;
                              return (
                                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-xs">
                                  <p className={`font-semibold mb-1 ${isTopDonor ? 'text-red-500' : 'text-gray-900'}`}>
                                    RFC: {data.name}
                                    {isTopDonor && ' 🏆'}
                                  </p>
                                  <p className="text-gray-700 mb-0.5">
                                    Total donado: ${data.totalDonated.toLocaleString()}
                                  </p>
                                  <p className="text-gray-700">
                                    No. donaciones: {data.count}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Scatter data={bubbleData} fill="#8884d8" shape="circle" isAnimationActive={false}>
                          {bubbleData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.name === topDonor ? '#EF4444' : '#94A3B8'}
                            />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-400">No hay datos disponibles</p>
                  </div>
                )}
              </div>
              {bubbleData.length > 0 && !loadingDonaciones && (
                <div className="flex justify-center gap-4 mt-3 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#94A3B8] mr-2"></div>
                    <span className="text-gray-700">Donantes</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#EF4444] mr-2"></div>
                    <span className="text-gray-700">Mayor donante</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 py-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Donantes</h2>
            </div>
        
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                        RFC
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                        Tipo de donante
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                        Monto donado en los últimos 6 meses (MXN)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                        Alertas
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loadingDonaciones ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          Cargando donantes...
                        </td>
                      </tr>
                    ) : donantes.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          No hay donantes registrados
                        </td>
                      </tr>
                    ) : (
                      donantes.map((donante, index) => (
                        <tr 
                          key={donante.rfc} 
                          onClick={() => openDonorModal(donante)}
                          className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} cursor-pointer hover:bg-blue-50 transition-colors`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {donante.nombre}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {donante.rfc}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {donante.tipo_persona}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${donante.donadoSeisMeses.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {donante.alertas && donante.alertas.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {donante.alertas.map((alerta, idx) => (
                                  <span
                                    key={idx}
                                    className={
                                      alerta.includes('PDL')
                                        ? 'px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium'
                                        : alerta.includes('efectivo')
                                        ? 'px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium'
                                        : 'px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium'
                                    }
                                  >
                                    {alerta}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>


        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 py-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Donaciones</h2>
            </div>
        
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                        Tipo de donativo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                        Monto (MXN)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                        RFC del donante
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                        CFDI
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loadingDonaciones ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          Cargando donaciones...
                        </td>
                      </tr>
                    ) : donaciones.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          No hay donaciones registradas
                        </td>
                      </tr>
                    ) : (
                      donaciones.map((donacion: Donation, index: number) => (
                        <tr 
                          key={donacion.ID} 
                          className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} cursor-pointer hover:bg-blue-50 transition-colors`}
                        >
                          <td 
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                            onClick={() => openDonationModal(donacion)}
                          >
                            {donacion.ID}
                          </td>
                          <td 
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                            onClick={() => openDonationModal(donacion)}
                          >
                            {new Date(donacion.Fecha).toLocaleDateString('es-MX', { 
                              year: 'numeric', 
                              month: '2-digit', 
                              day: '2-digit' 
                            })}
                          </td>
                          <td 
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            onClick={() => openDonationModal(donacion)}
                          >
                            {donacion.Tipo}
                          </td>
                          <td 
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                            onClick={() => openDonationModal(donacion)}
                          >
                            ${parseFloat(donacion.Tipo === 'especie' ? donacion.Valor_estimado : donacion.Monto).toLocaleString()}
                          </td>
                          <td 
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                            onClick={() => openDonationModal(donacion)}
                          >
                            {donacion.rfc_donantes}
                          </td>
                          <td 
                            className="px-6 py-4 whitespace-nowrap text-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex gap-2">
                              {!donacion.Necesita_CFDI && (
                                <span className="text-gray-400">No requerido</span>
                              )}
                              {!!donacion.Necesita_CFDI && !donacion.CFDI && (
                                <button
                                  onClick={() => triggerFileInput(donacion.ID)}
                                  className="px-3 py-1.5 bg-[#8BC34A] text-white rounded-lg hover:bg-[#7CB342] hover:cursor-pointer transition-colors text-xs font-medium"
                                >
                                  Subir CFDI
                                </button>
                              )}
                              {donacion.CFDI && (
                                <a
                                  href={donacion.CFDI}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                                >
                                  Ver CFDI
                                </a>
                              )}
                              
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Directorio de Abogados Especializados</h2>
          </div>

          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">Cargando abogados...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
            </div>
          ) : lawyers.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">No hay abogados disponibles</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lawyers.map((lawyer) => (
                <div 
                  key={lawyer.id} 
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
                >
                  {/* Header with Avatar and Badge */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#4A6B6D] to-[#3A5B5D] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
                      {lawyer.nombre.split(' ').map(n => n.charAt(0)).join('').substring(0, 2)}
                    </div>
                    <span className="px-4 py-1.5 bg-[#8BC34A] text-white text-xs font-bold rounded-full shadow-sm">
                      Verificado
                    </span>
                  </div>
                  
                  {/* Name */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                    {lawyer.nombre}
                  </h3>
                  
                  {/* Specialty */}
                  <p className="text-[#8BC34A] font-semibold mb-4 text-sm">
                    {lawyer.especialidad}
                  </p>

                  {/* Contact Info */}
                  <div className="mb-5">
                    <div className="flex items-center text-gray-700 gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-sm font-medium">{lawyer.telefono}</span>
                    </div>
                  </div>

                  {/* Contact Button */}
                  <a 
                    href={`tel:${lawyer.telefono}`}
                    className="block w-full py-3 bg-[#4A6B6D] text-white font-bold rounded-lg hover:bg-[#3A5B5D] transition-colors shadow-sm hover:shadow-md text-center"
                  >
                    Contactar
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Donor Details Modal */}
      {isDonorModalOpen && selectedDonor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Detalles del Donante</h2>
                <button
                  onClick={closeDonorModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Información Básica</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nombre</p>
                    <p className="text-base font-semibold text-gray-900">{selectedDonor.nombre}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">RFC</p>
                    <p className="text-base font-semibold text-gray-900">{selectedDonor.rfc}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tipo de Persona</p>
                    <p className="text-base font-semibold text-gray-900 capitalize">{selectedDonor.tipo_persona}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Donado (últimos 6 meses)</p>
                    <p className="text-base font-semibold text-gray-900">${selectedDonor.donadoSeisMeses.toLocaleString()}</p>
                  </div>
                  {selectedDonor.correo_electronico && (
                    <div>
                      <p className="text-sm text-gray-500">Correo Electrónico</p>
                      <p className="text-base font-semibold text-gray-900">{selectedDonor.correo_electronico}</p>
                    </div>
                  )}
                  {selectedDonor.telefono && (
                    <div>
                      <p className="text-sm text-gray-500">Teléfono</p>
                      <p className="text-base font-semibold text-gray-900">{selectedDonor.telefono}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Information */}
              {(selectedDonor.calle || selectedDonor.colonia) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Domicilio Fiscal</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {selectedDonor.calle && (
                      <div>
                        <p className="text-sm text-gray-500">Calle y Número</p>
                        <p className="text-base font-semibold text-gray-900">
                          {selectedDonor.calle} {selectedDonor.numero_exterior}
                        </p>
                      </div>
                    )}
                    {selectedDonor.colonia && (
                      <div>
                        <p className="text-sm text-gray-500">Colonia</p>
                        <p className="text-base font-semibold text-gray-900">{selectedDonor.colonia}</p>
                      </div>
                    )}
                    {selectedDonor.municipio && (
                      <div>
                        <p className="text-sm text-gray-500">Municipio</p>
                        <p className="text-base font-semibold text-gray-900">{selectedDonor.municipio}</p>
                      </div>
                    )}
                    {selectedDonor.estado && (
                      <div>
                        <p className="text-sm text-gray-500">Estado</p>
                        <p className="text-base font-semibold text-gray-900">{selectedDonor.estado}</p>
                      </div>
                    )}
                    {selectedDonor.codigo_postal_fiscal && (
                      <div>
                        <p className="text-sm text-gray-500">Código Postal</p>
                        <p className="text-base font-semibold text-gray-900">{selectedDonor.codigo_postal_fiscal}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tax Information */}
              {(selectedDonor.curp || selectedDonor.regimen_fiscal) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Información Fiscal</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {selectedDonor.curp && (
                      <div>
                        <p className="text-sm text-gray-500">CURP</p>
                        <p className="text-base font-semibold text-gray-900">{selectedDonor.curp}</p>
                      </div>
                    )}
                    {selectedDonor.regimen_fiscal && (
                      <div>
                        <p className="text-sm text-gray-500">Régimen Fiscal</p>
                        <p className="text-base font-semibold text-gray-900">{selectedDonor.regimen_fiscal}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Documents */}
              {(selectedDonor.identificacion || selectedDonor.constancia_situacion_fiscal || 
                selectedDonor.comprobante_domicilio || selectedDonor.acta_constitutiva || 
                selectedDonor.poderes_legales || selectedDonor.declaracion_beneficiario_controlador) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Documentos</h3>
                  <div className="space-y-3">
                  {selectedDonor.identificacion && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Identificación Oficial</span>
                      <a
                        href={selectedDonor.identificacion}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Ver Documento
                      </a>
                    </div>
                  )}
                  {selectedDonor.constancia_situacion_fiscal && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Constancia de Situación Fiscal</span>
                      <a
                        href={selectedDonor.constancia_situacion_fiscal}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Ver Documento
                      </a>
                    </div>
                  )}
                  {selectedDonor.comprobante_domicilio && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Comprobante de Domicilio</span>
                      <a
                        href={selectedDonor.comprobante_domicilio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Ver Documento
                      </a>
                    </div>
                  )}
                  {selectedDonor.acta_constitutiva && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Acta Constitutiva</span>
                      <a
                        href={selectedDonor.acta_constitutiva}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Ver Documento
                      </a>
                    </div>
                  )}
                  {selectedDonor.poderes_legales && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Poderes Legales</span>
                      <a
                        href={selectedDonor.poderes_legales}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Ver Documento
                      </a>
                    </div>
                  )}
                  {selectedDonor.declaracion_beneficiario_controlador && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Declaración Beneficiario Controlador</span>
                      <a
                        href={selectedDonor.declaracion_beneficiario_controlador}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Ver Documento
                      </a>
                    </div>
                  )}
                  </div>
                </div>
              )}

              {/* Alerts */}
              {selectedDonor.alertas && selectedDonor.alertas.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Alertas</h3>
                  <div className="space-y-2">
                    {selectedDonor.alertas.map((alerta, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg ${
                          alerta.includes('PDL')
                            ? 'bg-red-50 border border-red-200'
                            : alerta.includes('efectivo')
                            ? 'bg-orange-50 border border-orange-200'
                            : 'bg-yellow-50 border border-yellow-200'
                        }`}
                      >
                        <p className={`text-sm font-medium ${
                          alerta.includes('PDL')
                            ? 'text-red-800'
                            : alerta.includes('efectivo')
                            ? 'text-orange-800'
                            : 'text-yellow-800'
                        }`}>
                          {alerta}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl border-t">
              <button
                onClick={closeDonorModal}
                className="w-full px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Donation Details Modal */}
      {isDonationModalOpen && selectedDonation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Detalles de Donación</h2>
                <button
                  onClick={closeDonationModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Donation Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Información de la Donación</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">ID</p>
                    <p className="text-base font-semibold text-gray-900">{selectedDonation.ID}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <p className="text-base font-semibold text-gray-900">
                      {new Date(selectedDonation.Fecha).toLocaleDateString('es-MX', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tipo de Donativo</p>
                    <p className="text-base font-semibold text-gray-900 capitalize">{selectedDonation.Tipo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Monto</p>
                    <p className="text-base font-semibold text-gray-900">
                      ${parseFloat(selectedDonation.Tipo === 'especie' ? selectedDonation.Valor_estimado : selectedDonation.Monto).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">RFC del Donante</p>
                    <p className="text-base font-semibold text-gray-900">{selectedDonation.rfc_donantes}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Requiere CFDI</p>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedDonation.Necesita_CFDI ? 'Sí' : 'No'}
                    </p>
                  </div>
                </div>
              </div>

              {/* CFDI Section */}
              {selectedDonation.Necesita_CFDI === 1 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">CFDI</h3>
                  {selectedDonation.CFDI ? (
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <p className="text-sm font-medium text-green-800">CFDI Disponible</p>
                        <p className="text-xs text-green-600 mt-1">El comprobante fiscal está listo para descargar</p>
                      </div>
                      <a
                        href={selectedDonation.CFDI}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Ver CFDI
                      </a>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div>
                        <p className="text-sm font-medium text-yellow-800">CFDI Pendiente</p>
                        <p className="text-xs text-yellow-600 mt-1">El comprobante fiscal aún no ha sido cargado</p>
                      </div>
                      <button
                        onClick={() => triggerFileInput(selectedDonation.ID)}
                        className="px-4 py-2 bg-[#8BC34A] text-white rounded-lg hover:bg-[#7CB342] transition-colors text-sm font-medium"
                      >
                        Subir CFDI
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Documents */}
              {(selectedDonation.Declaracion_Origen_Recursos || selectedDonation.Carta_De_Donacion || 
                selectedDonation.Acreditacion_Propiedad || selectedDonation.Acreditacion_Valir_Propiedad) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Documentos</h3>
                  <div className="space-y-3">
                    {selectedDonation.Declaracion_Origen_Recursos && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Declaración de Origen de Recursos</span>
                        <a
                          href={selectedDonation.Declaracion_Origen_Recursos}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Ver Documento
                        </a>
                      </div>
                    )}
                    {selectedDonation.Carta_De_Donacion && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Carta de Donación</span>
                        <a
                          href={selectedDonation.Carta_De_Donacion}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Ver Documento
                        </a>
                      </div>
                    )}
                    {selectedDonation.Acreditacion_Propiedad && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Acreditación de Propiedad</span>
                        <a
                          href={selectedDonation.Acreditacion_Propiedad}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Ver Documento
                        </a>
                      </div>
                    )}
                    {selectedDonation.Acreditacion_Valir_Propiedad && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Acreditación de Valor de Propiedad</span>
                        <a
                          href={selectedDonation.Acreditacion_Valir_Propiedad}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Ver Documento
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl border-t">
              <button
                onClick={closeDonationModal}
                className="w-full px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}