'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
      
      setStats({
        montoTotal: total,
        cantidadDonaciones: data.length,
        alertasPDL: 0
      });

    } catch (err) {
      console.error('Error fetching donaciones:', err);
      setError('No se pudieron cargar las donaciones');
    } finally {
      setLoadingDonaciones(false);
    }
  };

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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Donaciones por Mes</h3>
              <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                <p className="text-gray-400">Gráfica pendiente</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Tipo</h3>
              <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                <p className="text-gray-400">Gráfica pendiente</p>
              </div>
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
                        <tr key={donante.rfc} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
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
                        <tr key={donacion.ID} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {donacion.ID}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(donacion.Fecha).toLocaleDateString('es-MX', { 
                              year: 'numeric', 
                              month: '2-digit', 
                              day: '2-digit' 
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {donacion.Tipo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${parseFloat(donacion.Tipo === 'especie' ? donacion.Valor_estimado : donacion.Monto).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {donacion.rfc_donantes}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
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
    </div>
  );
}