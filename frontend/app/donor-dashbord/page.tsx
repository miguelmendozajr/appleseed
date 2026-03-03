'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Donor {
  id: number;
  rfc: string;
  nombre: string;
  tipo_persona: 'fisica' | 'moral';
}

export default function DonorDashboard() {
  const router = useRouter();
  const [donor, setDonor] = useState<Donor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const donorData = localStorage.getItem('donor_data');
    if (!donorData) {
      router.push('/donor-login');
      return;
    }
    
    try {
      const parsed = JSON.parse(donorData);
      setDonor(parsed);
    } catch (e) {
      console.error('Error parsing donor data:', e);
      router.push('/donor-login');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('donor_data');
    router.push('/donor-login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8BC34A] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!donor) {
    return null; // Will redirect in useEffect
  }

  // Determinar el título según el tipo de persona
  const titulo = donor.tipo_persona === 'fisica' ? 'Sr(a).' : 'Empresa';
  const nombreOVer = donor.tipo_persona === 'fisica' ? donor.nombre : donor.nombre;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center">
              <span className="text-3xl font-bold">
                <span className="text-[#4A6B6D]">Apple</span>
                <span className="text-[#8BC34A]">seed</span>
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {donor.tipo_persona === 'fisica' ? '👤' : '🏢'} {donor.rfc}
              </span>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#8BC34A] to-[#7CB342] rounded-2xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center gap-4">
            <div className="text-5xl">
              {donor.tipo_persona === 'fisica' ? '👤' : '🏢'}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                ¡Bienvenido, {titulo} {nombreOVer}!
              </h1>
              <p className="text-white/90">
                {donor.tipo_persona === 'fisica' 
                  ? 'Gracias por apoyar a las organizaciones de la sociedad civil.'
                  : 'Gracias por contribuir como empresa al desarrollo social.'}
              </p>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Total Donado</h3>
            <p className="text-3xl font-bold text-[#8BC34A]">$0</p>
            <p className="text-sm text-gray-500 mt-2">Última donación: -</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-3">🏛️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Organizaciones</h3>
            <p className="text-3xl font-bold text-[#8BC34A]">0</p>
            <p className="text-sm text-gray-500 mt-2">Apoyadas este año</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-3">📄</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Comprobantes</h3>
            <p className="text-3xl font-bold text-[#8BC34A]">0</p>
            <p className="text-sm text-gray-500 mt-2">Disponibles para descarga</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Deducible</h3>
            <p className="text-3xl font-bold text-[#8BC34A]">$0</p>
            <p className="text-sm text-gray-500 mt-2">Monto deducible 2026</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Actividad Reciente</h2>
          <div className="text-center py-8 text-gray-500">
            <p className="text-4xl mb-3">📭</p>
            <p>No hay actividad reciente para mostrar</p>
            <p className="text-sm mt-2">Las donaciones que realices aparecerán aquí</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <h3 className="font-semibold">Hacer una donación</h3>
              <p className="text-sm text-gray-500">Apoya a una organización</p>
            </div>
          </button>
          
          <button className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <h3 className="font-semibold">Ver comprobantes</h3>
              <p className="text-sm text-gray-500">Descarga tus recibos</p>
            </div>
          </button>
          
          <button className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <h3 className="font-semibold">Ver historial</h3>
              <p className="text-sm text-gray-500">Todas tus donaciones</p>
            </div>
          </button>
        </div>

        {/* Additional Info for Moral Persons */}
        {donor.tipo_persona === 'moral' && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🏢</span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Beneficios para Personas Morales</h3>
                <p className="text-sm text-gray-700">
                  Como persona moral, tus donaciones pueden ser deducibles de impuestos. 
                  Recuerda que necesitas mantener tus comprobantes fiscales actualizados.
                </p>
                <ul className="mt-3 text-sm text-gray-700 list-disc list-inside">
                  <li>Deducción fiscal del 7% sobre utilidad fiscal</li>
                  <li>Comprobantes digitales inmediatos</li>
                  <li>Reportes anuales automáticos</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}