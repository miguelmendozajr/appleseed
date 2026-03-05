import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Problem from '@/components/landing/Problem';
import HowItWorks from '@/components/landing/HowItWorks';
import Features from '@/components/landing/Features';
import Benefits from '@/components/landing/Benefits';
import CTA from '@/components/landing/CTA';
import AuthEntrySection from '@/components/landing/AuthEntrySection';

export const metadata = {
  title: 'CompliOSC - Cumplimiento Legal Inteligente para OSC en México',
  description:
    'Centraliza SAT, UIF y CLUNI en un solo dashboard. Reduce errores, evita multas y automatiza tu cumplimiento normativo.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <AuthEntrySection />
      <Problem />
      <HowItWorks />
      <Features />
      <Benefits />
      <CTA />
    </div>
  );
}
