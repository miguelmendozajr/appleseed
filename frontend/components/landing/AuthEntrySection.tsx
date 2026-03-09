'use client';

import React from 'react';
import Link from 'next/link';
import { LogIn, UserPlus } from 'lucide-react';

export default function AuthEntrySection() {
  const cards = [
    {
      title: 'Iniciar sesión para Donate',
      desc: 'Accede como donante para gestionar tus donaciones.',
      href: '/donate/login',
      icon: LogIn,
    },
    {
      title: 'Registrar Donate',
      desc: 'Crea tu cuenta de donante en pocos pasos.',
      href: '/donate/register',
      icon: UserPlus,
    },
    {
      title: 'Iniciar sesión para Organizaciones',
      desc: 'Entra como organización y monitorea cumplimiento.',
      href: '/org/login',
      icon: LogIn,
    },
    {
      title: 'Registro de Organizaciones',
      desc: 'Registra tu organización para empezar.',
      href: '/org/register',
      icon: UserPlus,
    },
  ];

  return (
    <section id="acceso" className="py-20 bg-emerald-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 xl:px-8">
        {/* optional gradient overlay to soften background */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 to-emerald-50" />
        <div className="relative">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            <span className="block text-emerald-800">Únete</span>
            <span className="block text-slate-800 mt-1">con nosotros</span>
          </h2>
          <p className="mt-4 mx-auto max-w-xl text-lg sm:text-xl leading-relaxed text-slate-700">
            Elige tu vía de acceso y empieza a disfrutar de los beneficios de CompliOSC.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {cards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <Link
                key={idx}
                href={card.href}
                className="block bg-white rounded-2xl p-10 min-h-[280px] border border-transparent shadow-md transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <div className="flex items-center mb-4">
                  <IconComponent className="w-8 h-8 text-emerald-600" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">{card.title}</h3>
                <p className="text-slate-700 text-base leading-relaxed">{card.desc}</p>
                <span className="inline-block mt-8 px-6 py-3 bg-teal-600 text-white font-medium rounded-lg">
                  Ir
                </span>
              </Link>
            );
          })}
        </div>

        {/* divider */}
        <div className="mt-16">
          <hr className="border-slate-200/300" />
        </div>
      </div> {/* end relative wrapper */}
      </div> {/* end max-w container */}
    </section>
  );
}
