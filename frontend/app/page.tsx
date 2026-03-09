import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Problem from '@/components/landing/Problem';
import HowItWorks from '@/components/landing/HowItWorks';
import Features from '@/components/landing/Features';
import Benefits from '@/components/landing/Benefits';
import CTA from '@/components/landing/CTA';
import AuthEntrySection from '@/components/landing/AuthEntrySection';

export const metadata = {
  title: 'Appleseed - Plataforma de Gestión de Donaciones para OSC en México',
  description:
    'Gestiona donantes, donaciones y cumplimiento normativo. Optimiza CFDI y alertas PDL.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <AuthEntrySection />
      <Problem />
      <HowItWorks />
      <Benefits />
    </div>
  );
}
