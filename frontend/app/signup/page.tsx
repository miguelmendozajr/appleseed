'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DonorSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    rfc: '',
    nombre: '',
    contraseña: '',
    confirmContraseña: '',
    tipo_persona: 'fisica' // Valor por defecto
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validateRFC = (rfc: string) => {
    const rfcRegex = /^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{2,3}$/;
    return rfcRegex.test(rfc);
  };

  const validateRFCForType = (rfc: string, tipo: string) => {
    if (tipo === 'fisica' && rfc.length !== 13) {
      return false;
    }
    if (tipo === 'moral' && rfc.length !== 12) {
      return false;
    }
    return validateRFC(rfc);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validar RFC según el tipo de persona
    if (!validateRFCForType(formData.rfc, formData.tipo_persona)) {
      if (formData.tipo_persona === 'fisica') {
        setError('El RFC de persona física debe tener 13 caracteres');
      } else {
        setError('El RFC de persona moral debe tener 12 caracteres');
      }
      return;
    }

    // Validar contraseñas
    if (formData.contraseña !== formData.confirmContraseña) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.contraseña.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      console.log('Sending to:', `${backendUrl}/api/donors/login`);
      console.log('Data:', { 
        rfc: formData.rfc, 
        nombre: formData.nombre, 
        tipo_persona: formData.tipo_persona,
        contraseña: '***' 
      });

      const response = await fetch(`${backendUrl}/api/donors/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rfc: formData.rfc,
          nombre: formData.nombre,
          contraseña: formData.contraseña,
          tipo_persona: formData.tipo_persona
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('¡Registro exitoso! Redirigiendo...');
        localStorage.setItem('donor_data', JSON.stringify(data));
        
        setTimeout(() => {
          router.push('/donor-dashboard');
        }, 2000);
      } else {
        setError(data.error || 'Error al registrar donante');
      }
    } catch (err) {
      setError('Error de conexión. Por favor intenta de nuevo.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center">
              <span className="text-3xl font-bold">
                <span className="text-[#4A6B6D]">Apple</span>
                <span className="text-[#8BC34A]">seed</span>
              </span>
              <p className="ml-4 text-sm text-[#6B9FD4]">Sembrando la semilla de la justicia</p>
            </Link>
            <Link 
              href="/login" 
              className="px-4 py-2 text-sm font-semibold text-[#8BC34A] border border-[#8BC34A] rounded-lg hover:bg-[#8BC34A] hover:text-white transition-colors"
            >
              Organizaciones
            </Link>
          </div>
        </div>
      </nav>

      {/* Signup Form */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Registro de Donantes
              </h1>
              <p className="text-gray-600">
                Crea tu cuenta para comenzar a donar
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}

              {/* Tipo de Persona - RADIO BUTTONS MEJORADOS */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Tipo de Persona <span className="text-red-500">*</span>
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Persona Física */}
                  <label 
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.tipo_persona === 'fisica' 
                        ? 'border-[#8BC34A] bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipo_persona"
                      value="fisica"
                      checked={formData.tipo_persona === 'fisica'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        tipo_persona: e.target.value,
                        rfc: '' 
                      })}
                      className="sr-only"
                    />
                    <div className="flex items-center w-full">
                      <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        formData.tipo_persona === 'fisica' 
                          ? 'border-[#8BC34A] bg-[#8BC34A]' 
                          : 'border-gray-300'
                      }`}>
                        {formData.tipo_persona === 'fisica' && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800">Persona Física</span>
                        <p className="text-xs text-gray-500 mt-1">RFC de 13 caracteres</p>
                      </div>
                      <span className="ml-auto text-2xl">👤</span>
                    </div>
                  </label>

                  {/* Persona Moral */}
                  <label 
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.tipo_persona === 'moral' 
                        ? 'border-[#8BC34A] bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipo_persona"
                      value="moral"
                      checked={formData.tipo_persona === 'moral'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        tipo_persona: e.target.value,
                        rfc: '' 
                      })}
                      className="sr-only"
                    />
                    <div className="flex items-center w-full">
                      <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        formData.tipo_persona === 'moral' 
                          ? 'border-[#8BC34A] bg-[#8BC34A]' 
                          : 'border-gray-300'
                      }`}>
                        {formData.tipo_persona === 'moral' && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800">Persona Moral</span>
                        <p className="text-xs text-gray-500 mt-1">RFC de 12 caracteres</p>
                      </div>
                      <span className="ml-auto text-2xl">🏢</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* RFC Field */}
              <div>
                <label htmlFor="rfc" className="block text-sm font-semibold text-gray-700 mb-2">
                  RFC <span className="text-red-500">*</span>
                </label>
                <input
                  id="rfc"
                  type="text"
                  required
                  value={formData.rfc}
                  onChange={(e) => setFormData({ ...formData, rfc: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent transition-all"
                  placeholder={formData.tipo_persona === 'fisica' ? 'Ej: ABCD123456XYZ' : 'Ej: ABC123456XYZ'}
                  maxLength={formData.tipo_persona === 'fisica' ? 13 : 12}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.tipo_persona === 'fisica' 
                    ? 'Persona física: 13 caracteres' 
                    : 'Persona moral: 12 caracteres'}
                </p>
              </div>

              {/* Nombre/Razón Social Field */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-2">
                  {formData.tipo_persona === 'fisica' ? 'Nombre Completo' : 'Razón Social'} <span className="text-red-500">*</span>
                </label>
                <input
                  id="nombre"
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent transition-all"
                  placeholder={formData.tipo_persona === 'fisica' ? 'Ingresa tu nombre completo' : 'Ingresa la razón social'}
                />
              </div>

              {/* Contraseña Field */}
              <div>
                <label htmlFor="contraseña" className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  id="contraseña"
                  type="password"
                  required
                  value={formData.contraseña}
                  onChange={(e) => setFormData({ ...formData, contraseña: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent transition-all"
                  placeholder="Mínimo 8 caracteres"
                  minLength={8}
                />
              </div>

              {/* Confirm Contraseña Field */}
              <div>
                <label htmlFor="confirmContraseña" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmar Contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  id="confirmContraseña"
                  type="password"
                  required
                  value={formData.confirmContraseña}
                  onChange={(e) => setFormData({ ...formData, confirmContraseña: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent transition-all"
                  placeholder="Confirma tu contraseña"
                  minLength={8}
                />
              </div>

              {/* Password strength indicator */}
              {formData.contraseña && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Seguridad de contraseña:</span>
                    <span className={
                      formData.contraseña.length < 8 ? 'text-red-600' :
                      formData.contraseña.length < 10 ? 'text-yellow-600' :
                      'text-green-600'
                    }>
                      {formData.contraseña.length < 8 ? 'Débil' :
                       formData.contraseña.length < 10 ? 'Media' : 'Fuerte'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        formData.contraseña.length < 8 ? 'bg-red-500 w-1/3' :
                        formData.contraseña.length < 10 ? 'bg-yellow-500 w-2/3' :
                        'bg-green-500 w-full'
                      }`}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#8BC34A] text-white font-semibold rounded-lg hover:bg-[#7CB342] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Registrando...' : 'Registrarse'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link href="/donor-login" className="text-[#8BC34A] font-semibold hover:text-[#7CB342] transition-colors">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>

          {/* Information Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <span className="text-2xl mr-3">📝</span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Acerca del RFC</h3>
                <p className="text-sm text-gray-700">
                  <strong>Persona Física:</strong> 13 caracteres (ej: ABCD123456XYZ)<br/>
                  <strong>Persona Moral:</strong> 12 caracteres (ej: ABC123456XYZ)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}