// Navigation links
export const navLinks = [
  { label: 'Acceso', href: '#acceso'},
  { label: 'Problema', href: '#problema' },
  { label: 'Solución', href: '#solucion' },
  { label: 'Beneficios', href: '#beneficios' }
];

// Hero section
export const heroData = {
  title: 'Cumplimiento Legal Inteligente',
  titleHighlight: 'para OSC en México',
  description:
    'Reduce errores, evita multas y automatiza tu cumplimiento normativo.',
  stats: '+10 OSC ya gestionan su cumplimiento',
};

// How it works section (3 steps)
export const howItWorksData = {
  title: '¿Cómo funciona nuestra solución?',
  subtitle:
    'Automatiza, monitorea y recibe alertas para que tu OSC nunca pierda el control.',
  steps: [
    {
      number: 1,
      title: 'Ingresa tus datos',
      description:
        'Seas donante o organización civil, puedes registrate utilizanodo tu RFC y una contraseña.',
      features: [
        'Solo usuarios autorizados pueden acceder a nuestro sistema',
        'Sin necesidad de ingresar datos sensibles en un inicio',
        'Registro en menos de 5 minutos'
      ],
    },
    {
      number: 2,
      title: 'Solicita documentos a tus donantes',
      description:
        'La plataforma facilita que tu OSC solicite y recabe los documentos requeridos de cada donante. Toda la información necesaria para reportar al SAT en caso de ser requerido, organizada y accesible.',
      features: [
        'Solicitudes automatizadas de documentos',
        'Repositorio organizado por donante',
        'Cumplimiento SAT simplificado',
      ],
    },
    {
      number: 3,
      title: 'Monitorea alertas en tiempo real',
      description:
        'Identifica automáticamente situaciones de riesgo como operaciones PDL, donaciones en efectivo y documentos faltantes. Visualiza alertas codificadas por color directamente en tu dashboard.',
      features: [
        'Detección automática de riesgos PDL',
        'Alertas por donaciones en efectivo',
        'Seguimiento de CFDIs',
      ],
    },
  ],
};

// Problem section
export const problemData = {
  title: 'La gestión de cumplimiento hoy es insostenible',
  problems: [
    {
      id: 1,
      stat: '3×',
      statLabel: 'más tiempo administrativo',
      title: 'Captura duplicada en portales',
      description:
        'Los equipos ingresan la misma información en SAT, UIF y CLUNI por separado, multiplicando el riesgo de error y el tiempo invertido.',
      icon: 'Clipboard',
      theme: 'yellow' as const,
    },
    {
      id: 2,
      stat: '$5M',
      statLabel: 'MXN en sanciones potenciales',
      title: 'Multas hasta $5,000,000 MXN',
      description:
        'El incumplimiento ante SAT o UIF puede generar sanciones económicas severas y la cancelación del registro de donataria autorizada.',
      icon: 'AlertTriangle',
      theme: 'red' as const,
    },
    {
      id: 3,
      stat: '10 años',
      statLabel: 'de retención obligatoria',
      title: 'Retención obligatoria 10 años',
      description:
        'La normativa exige conservar documentos fiscales y de actividades vulnerables por una década. Sin un sistema adecuado, esto es un riesgo latente.',
      icon: 'FileText',
      theme: 'blue' as const,
    },
    {
      id: 4,
      stat: '68%',
      statLabel: 'de OSC reportan errores frecuentes',
      title: 'Error humano bajo presión',
      description:
        'Fechas, formularios y requisitos distintos por autoridad, gestionados manualmente, crean un entorno propicio para omisiones costosas.',
      icon: 'Clock',
      theme: 'purple' as const,
    },
  ],
};

// Features/Platform section
import { LayoutDashboard, BellRing, ShieldCheck, Clock, TrendingUp, Trophy } from 'lucide-react';

export const featuresData = {
  title: 'Una plataforma diseñada específicamente para OSC',
  subtitle:
    'No es un software genérico adaptado. Es una herramienta construida entendiendo la realidad legal y operativa de las organizaciones de la sociedad civil en México.',
  features: [
    {
      id: 1,
      icon: LayoutDashboard,
      title: 'Dashboard Centralizado de Cumplimiento',
      description:
        'Visualiza todas tus obligaciones regulatorias en una sola interfaz. Paneles por autoridad, semáforos de riesgo y reportes en tiempo real.',
      badge: 'MÁS POPULAR',
      highlights: [
        'Estado de obligaciones por autoridad',
        'Semáforo de riesgo regulatorio',
        'Reportes automáticos ejecutivos',
      ],
    },
    {
      id: 2,
      icon: BellRing,
      title: 'Alertas Regulatorias Automatizadas',
      description:
        'Recibe notificaciones anticipadas antes de cada vencimiento. Configura recordatorios para tu equipo sin depender de calendarios manuales.',
      badge: 'ALERTAS INTELIGENTES',
      highlights: [
        'Notificaciones por email y en plataforma',
        'Recordatorios automáticos a tu equipo',
        'Calendario de obligaciones integrado',
      ],
    },
    {
      id: 3,
      icon: ShieldCheck,
      title: 'Archivo Digital Seguro 10 Años',
      description:
        'Guarda contratos, declaraciones y evidencia documental con cifrado de grado bancario. Accede a cualquier documento en segundos.',
      badge: 'ALMACENAMIENTO SEGURO',
      highlights: [
        'Cifrado AES-256 en reposo y tránsito',
        'Búsqueda inteligente por metadatos',
        'Cumple la NOM de retención documental',
      ],
    },
  ],
};


// Benefits/Results section
export const benefitsData = {
  title: 'Resultados que tu organización puede medir',
  subtitle:
    'No prometemos simplificación vaga. Entregamos métricas concretas que impactan la operación y la credibilidad institucional de tu OSC.',
  results: [
    {
      id: 1,
      stat: '−65%',
      title: 'Tiempo administrativo',
      description: 'Elimina la captura manual y reduce a la mitad el tiempo que tu equipo destina a trámites regulatorios.',
      icon: Clock,
    },
    {
      id: 2,
      stat: '0 multas',
      title: 'Riesgo regulatorio mínimo',
      description:
        'Las alertas anticipadas y el monitoreo continuo minimizan la probabilidad de incumplimientos costosos.',
      icon: ShieldCheck,
    },
    {
      id: 3,
      stat: '100%',
      title: 'Transparencia institucional',
      description:
        'Genera reportes de cumplimiento para consejo directivo, donantes y autoridades con un solo clic.',
      icon: TrendingUp,
    },
    {
      id: 4,
      stat: '↑ Nivel pro',
      title: 'OSC profesionalizada',
      description:
        'Accede a financiamiento y convenios que exigen demostrar solidez operativa y transparencia fiscal.',
      icon: Trophy,
    },
  ],
};

// Testimonials
export const testimonialsData = [
  {
    id: 1,
    quote:
      'Antes teníamos un excel por cada autoridad. Hoy todo el equipo tiene visibilidad del cumplimiento en tiempo real. Nuestra auditoría del año pasado fue impecable.',
    author: 'Ana González',
    role: 'Directora Ejecutiva, Fundación Camino Real',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=56&h=56&fit=crop',
  },
  {
    id: 2,
    quote:
      'El sistema nos avisó que teníamos una declaración UIF pendiente que no habíamos visto. Nos salvó de una multa importante. La inversión se pagó sola el primer mes.',
    author: 'Carlos Mendoza',
    role: 'Gerente Administrativo, Red de Inclusión México',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=56&h=56&fit=crop',
  },
];

// CTA section
export const ctaData = {
  title: 'Empieza a gestionar tu cumplimiento de forma inteligente',
  description:
    'Únete a las OSC que ya profesionalizaron su gestión regulatoria. Agenda una demostración personalizada de 30 minutos, sin compromiso.',
  cta: 'Agendar Demo',
  features: [
    'Sin tarjeta de crédito',
    'Demo personalizada 30 min',
    'Datos 100% protegidos',
  ],
};

// Footer
export const footerData = {
  company: 'CompliOSC',
  tagline:
    'Plataforma de cumplimiento normativo inteligente para organizaciones de la sociedad civil en México.',
  services: ['Dashboard', 'Módulo SAT', 'Módulo UIF', 'Módulo CLUNI', 'Archivo Digital', 'Alertas'],
  contact: {
    email: 'contacto@compliosc.mx',
    phone: '+52 55 0000 0000',
    location: 'Ciudad de México, México',
  },
  integrations: 'INTEGRADO CON LAS PLATAFORMAS OFICIALES',
  integrationsList: [
    'SAT: Servicio de Administración Tributaria',
    'UIF: Unidad de Inteligencia Financiera',
    'CLUNI: Clave Única de Inscripción',
    'SPPLD: Sistema de Prevención de Lavado',
  ],
  legal: [
    { label: 'Aviso de Privacidad', href: '#' },
    { label: 'Términos de Uso', href: '#' },
    { label: 'Seguridad', href: '#' },
  ],
  copyright: '© 2026 CompliOSC. Todos los derechos reservados.',
};
