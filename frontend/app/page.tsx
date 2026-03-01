import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <span className="text-3xl font-bold">
                <span className="text-[#4A6B6D]">Apple</span>
                <span className="text-[#8BC34A]">seed</span>
              </span>
              <p className="ml-4 text-sm text-[#6B9FD4]">Sembrando la semilla de la justicia</p>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#about" className="text-gray-700 hover:text-[#8BC34A] transition-colors mt-3">
                Acerca
              </a>
              <a href="#features" className="text-gray-700 hover:text-[#8BC34A] transition-colors mt-3">
                Características
              </a>
              <a href="#services" className="text-gray-700 hover:text-[#8BC34A] transition-colors mt-3">
                Servicios
              </a>
              <Link href="/login" className="px-6 py-2 border-2 border-[#8BC34A] text-[#8BC34A] rounded-lg hover:bg-[#8BC34A] hover:text-white transition-colors text-center">
                Iniciar sesión
              </Link>
              <button className="px-6 py-2 bg-[#8BC34A] text-white rounded-lg hover:bg-[#7CB342] transition-colors">
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Gestión Integral de Donativos
              <br />
              <span className="text-[#8BC34A]">para Organizaciones Civiles</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Automatiza el cumplimiento fiscal y prevención de lavado de dinero. 
              Centraliza información, genera alertas regulatorias y protege tu organización.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-[#8BC34A] text-white text-lg font-semibold rounded-lg hover:bg-[#7CB342] transition-colors shadow-lg">
                Comenzar Ahora
              </button>
              <button className="px-8 py-4 border-2 border-[#4A6B6D] text-[#4A6B6D] text-lg font-semibold rounded-lg hover:bg-[#4A6B6D] hover:text-white transition-colors">
                Ver Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué Appleseed?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Las OSC enfrentan desafíos críticos en cumplimiento regulatorio
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-red-50 p-8 rounded-lg border-l-4 border-red-500">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Carga Administrativa</h3>
              <p className="text-gray-600">
                Captura duplicada en múltiples portales: SAT, UIF, CLUNI. Alto riesgo de error humano.
              </p>
            </div>
            
            <div className="bg-orange-50 p-8 rounded-lg border-l-4 border-orange-500">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Multas Millonarias</h3>
              <p className="text-gray-600">
                Sanciones superiores a $5,000,000 MXN por incumplimiento en prevención de lavado de dinero.
              </p>
            </div>
            
            <div className="bg-yellow-50 p-8 rounded-lg border-l-4 border-yellow-500">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Resguardo Obligatorio</h3>
              <p className="text-gray-600">
                Conservación de información por 10 años con historial auditable y completo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Características Principales
            </h2>
            <p className="text-xl text-gray-600">
              Automatización completa del cumplimiento regulatorio
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#8BC34A] rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl text-white">👥</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Gestión de Donantes</h3>
              <p className="text-gray-600">
                Alta de personas físicas y morales con validación automática de RFC, identificación de PEP y control de expedientes.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#8BC34A] rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl text-white">💳</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Registro de Donativos</h3>
              <p className="text-gray-600">
                Captura de fecha, monto, método de pago con generación automática de CFDI y clasificación por umbrales legales.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#8BC34A] rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl text-white">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Monitoreo de Umbrales</h3>
              <p className="text-gray-600">
                Alertas automáticas: ≥1,605 UMAs para expediente PLD, efectivo {'>'}$100,000 MXN para SAT, acumulados por donante.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#8BC34A] rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl text-white">📄</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Generación de Avisos</h3>
              <p className="text-gray-600">
                Creación automática de reportes SPPLD (PLD), Avisos de Transparencia e Informe anual CLUNI en formatos compatibles.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#8BC34A] rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl text-white">🔔</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sistema de Alertas</h3>
              <p className="text-gray-600">
                Notificaciones de umbrales superados, fechas límite de reportes y faltantes en expedientes de donantes.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#8BC34A] rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl text-white">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Resguardo Seguro</h3>
              <p className="text-gray-600">
                Conservación automática por 10 años con encriptación de datos sensibles e historial completamente auditable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-20 bg-[#4A6B6D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Cumplimiento Regulatorio Automatizado
            </h2>
            <p className="text-xl text-gray-200">
              Integración con todas las instancias gubernamentales
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white bg-opacity-10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🏛️</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">SAT</h3>
              <p className="text-gray-200">
                CFDI automático y Avisos de Transparencia. Detección de donaciones en efectivo {'>'}$100,000 MXN.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white bg-opacity-10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🛡️</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">UIF</h3>
              <p className="text-gray-200">
                Sistema de Prevención de Lavado de Dinero (SPPLD) con validación de umbrales y generación de reportes.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white bg-opacity-10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📋</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">CLUNI</h3>
              <p className="text-gray-200">
                Validación automática de donatarias autorizadas e informes anuales para Secretaría de Bienestar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Asesoría Legal Especializada
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Conectamos tu organización con profesionistas especializados en prevención de lavado de dinero y cumplimiento fiscal.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-[#8BC34A] text-2xl mr-3">✓</span>
                  <span className="text-gray-700">Abogados especializados en PLD/FT</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8BC34A] text-2xl mr-3">✓</span>
                  <span className="text-gray-700">Asesoría en cumplimiento regulatorio</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8BC34A] text-2xl mr-3">✓</span>
                  <span className="text-gray-700">Revisión de expedientes y documentación</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8BC34A] text-2xl mr-3">✓</span>
                  <span className="text-gray-700">Apoyo en auditorías y verificaciones</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="text-6xl mb-4 text-center">⚖️</div>
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">
                Directorio de Profesionistas
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Accede a una red de expertos verificados listos para apoyar a tu organización
              </p>
              <button className="w-full px-6 py-3 bg-[#4A6B6D] text-white font-semibold rounded-lg hover:bg-[#3A5B5D] transition-colors">
                Ver Abogados
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#8BC34A] to-[#7CB342]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para simplificar tu cumplimiento regulatorio?
          </h2>
          <p className="text-xl text-white mb-8 opacity-90">
            Únete a las organizaciones civiles que confían en Appleseed para gestionar sus donativos de manera segura y transparente.
          </p>
          <button className="px-10 py-4 bg-white text-[#8BC34A] text-lg font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
            Registra tu Organización
          </button>
        </div>
      </section>
    </div>
  );
}
