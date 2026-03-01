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

export default function DashboardPage() {
  const router = useRouter();
  const [oscData, setOscData] = useState<OSCData | null>(null);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const storedData = localStorage.getItem('osc_data');
    if (!storedData) {
      router.push('/login');
      return;
    }

    setOscData(JSON.parse(storedData));

    // Fetch lawyers
    fetchLawyers();
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

  const handleLogout = () => {
    localStorage.removeItem('osc_data');
    router.push('/');
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
              <p className="ml-4 text-sm text-[#6B9FD4]">Dashboard</p>
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido, {oscData?.nombre}
          </h1>
          <p className="text-gray-600">
            Panel de control de gestión de donativos
          </p>
        </div>

        {/* Graphics Section - Placeholder */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Estadísticas</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#8BC34A]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Donativos</p>
                  <p className="text-3xl font-bold text-gray-900">-</p>
                </div>
                <div className="w-12 h-12 bg-[#8BC34A] bg-opacity-10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#4A6B6D]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Donantes Activos</p>
                  <p className="text-3xl font-bold text-gray-900">-</p>
                </div>
                <div className="w-12 h-12 bg-[#4A6B6D] bg-opacity-10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Alertas Pendientes</p>
                  <p className="text-3xl font-bold text-gray-900">-</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500 bg-opacity-10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
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
