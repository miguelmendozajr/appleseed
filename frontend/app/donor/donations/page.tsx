'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface DonorData {
  rfc: string;
  nombre: string;
  tipo_persona: string;
}

interface Donation {
  ID: number;
  Fecha: string;
  Tipo: string;
  Monto: string;
  Valor_estimado: string;
  rfc_OSC: string;
  Necesita_CFDI: number;
  CFDI: string | null;
}

export default function DonorDonationsPage() {
  const router = useRouter();
  const [donorData, setDonorData] = useState<DonorData | null>(null);
  const [donaciones, setDonaciones] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if donor is logged in
    const storedData = localStorage.getItem('donor_data');
    if (!storedData) {
      router.push('/donor/login');
      return;
    }

    const parsedData = JSON.parse(storedData);
    setDonorData(parsedData);

    // Fetch donor's donations
    fetchDonaciones(parsedData.rfc);
  }, [router]);

  const fetchDonaciones = async (rfc: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/donations/donor/${rfc}`,
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
    } catch (err) {
      console.error('Error fetching donaciones:', err);
      setError('No se pudieron cargar las donaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('donor_data');
    router.push('/');
  };

  const getTotalDonated = () => {
    return donaciones.reduce((total, donacion) => {
      const amount = donacion.Tipo === 'especie' 
        ? parseFloat(donacion.Valor_estimado) 
        : parseFloat(donacion.Monto);
      return total + amount;
    }, 0);
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
            <div className="flex items-center space-x-8">
              <button
                onClick={() => router.push('/donor/dashboard')}
                className="text-sm font-medium text-gray-600 hover:text-[#8BC34A] hover:cursor-pointer transition-colors"
              >
                Organizaciones
              </button>
              <button
                onClick={() => router.push('/donor/donations')}
                className="text-sm font-medium text-[#4A6B6D] hover:text-[#8BC34A] hover:cursor-pointer transition-colors border-b-2 border-[#4A6B6D] pb-1"
              >
                Mis Donaciones
              </button>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{donorData?.nombre || 'Donante'}</p>
                <p className="text-xs text-gray-500">{donorData?.rfc}</p>
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
        {/* Stats Section */}
        <div className="mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#8BC34A]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total donado</p>
                  <p className="text-3xl font-bold text-gray-900">${getTotalDonated().toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#4A6B6D]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Cantidad de donaciones</p>
                  <p className="text-3xl font-bold text-gray-900">{donaciones.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Donations Table */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 py-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Mis Donaciones</h2>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}
        
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
                        OSC Beneficiaria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                        CFDI
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
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
                            {donacion.rfc_OSC}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              {!donacion.Necesita_CFDI && (
                                <span className="text-gray-400">No requerido</span>
                              )}
                              {!!donacion.Necesita_CFDI && !donacion.CFDI && (
                                <span className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-lg text-xs font-medium">
                                  Pendiente
                                </span>
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
      </div>
    </div>
  );
}