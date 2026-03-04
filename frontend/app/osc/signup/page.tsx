'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    rfc: '',
    nombre: '',
    contrasena: '',
    descripcion: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.rfc.trim() !== '' &&
      formData.nombre.trim() !== '' &&
      formData.descripcion.trim() !== '' &&
      formData.contrasena.length >= 6 &&
      formData.confirmPassword.length >= 6 &&
      formData.contrasena === formData.confirmPassword
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate password confirmation
    if (formData.contrasena !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/osc/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rfc: formData.rfc,
          nombre: formData.nombre,
          contrasena: formData.contrasena,
          descripcion: formData.descripcion
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store user data in localStorage or session
        localStorage.setItem('osc_data', JSON.stringify(data.data));
        
        // Redirect to dashboard
        router.push('/osc/dashboard');
      } else {
        setError(data.message || 'Error al registrarse');
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
              href="/donor/signup" 
              className="px-4 py-2 text-sm font-semibold text-[#8BC34A] border border-[#8BC34A] rounded-lg hover:bg-[#8BC34A] hover:text-white transition-colors"
            >
                Ir al registro de donadores
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Registrarse
              </h1>
              <p className="text-gray-600">
                Crea una cuenta para tu organización
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="rfc" className="block text-sm font-semibold text-gray-700 mb-2">
                  RFC
                </label>
                <input
                  id="rfc"
                  type="text"
                  required
                  value={formData.rfc}
                  onChange={(e) => setFormData({ ...formData, rfc: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black transition-colors"
                  placeholder="Ej: ABC123456XYZ"
                  maxLength={13}
                />
              </div>

              <div>
                <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre
                </label>
                <input
                  id="nombre"
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black transition-colors"
                  placeholder="Escribe el nombre de tu organización civil"
                  maxLength={100}
                />
              </div>

                <div>
                <label htmlFor="descripcion" className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción
                </label>
                <textarea
                    id="descripcion"
                    required
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black transition-colors resize-none"
                    placeholder="Escribe una breve descripción de tu organización civil"
                    rows={4}
                />
                </div>

              <div>
                <label htmlFor="contrasena" className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña
                </label>
                <input
                  id="contrasena"
                  type="password"
                  required
                  value={formData.contrasena}
                  onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black transition-colors"
                  placeholder="Ingresa tu contraseña"
                  minLength={6}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirmar Contraseña
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black transition-colors"
                  placeholder="Confirma tu contraseña"
                  minLength={6}
                />
              </div>

                <button
                type="submit"
                disabled={loading || !isFormValid()}
                className="w-full py-3 bg-[#8BC34A] text-white font-semibold rounded-lg hover:bg-[#7CB342] hover:cursor-pointer transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                {loading ? 'Registrando...' : 'Registrarse'}
                </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link href="/osc/login" className="text-[#8BC34A] font-semibold hover:text-[#7CB342] transition-colors">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}