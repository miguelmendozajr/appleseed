'use client';

import React from 'react';
import { heroData } from './data';
import { FolderArchive, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-white to-white pointer-events-none" />

      {/* Main content */}
      <div className="relative px-6 sm:px-8 py-20 sm:py-32 lg:py-40">
        <div className="max-w-7xl mx-auto">
          {/* Grid: text on left, mockup on right */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12 lg:items-start">
            {/* LEFT SECTION */}
            <div className="col-span-1 flex flex-col">
              {/* Badge */}
              <div className="inline-flex items-center px-3.5 py-1.5 bg-emerald-50 rounded-full mb-6 border border-emerald-200/50 w-fit">
                <svg className="w-4 h-4 text-teal-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-medium text-teal-700">{heroData.badge}</span>
              </div>

              {/* Heading */}
              <h1 className="text-5xl sm:text-6xl lg:text-6xl font-bold text-gray-950 mb-6 lg:mb-7 leading-tight tracking-tight">
                {heroData.title}
                <br />
                <span className="text-teal-600">{heroData.titleHighlight}</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-gray-600 mb-8 lg:mb-10 leading-relaxed max-w-xl">
                {heroData.description}
              </p>

              {/* Social proof row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10 lg:mb-12">
                {/* Avatars */}
                <div className="flex -space-x-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 border-2 border-white shadow-sm"
                    />
                  ))}
                </div>

                {/* Stats & Stars */}
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{heroData.stats}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-12 lg:mb-14">
                {/* Primary CTA */}
                <button className="group flex items-center justify-center px-7 py-3.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-all duration-200 hover:shadow-lg hover:shadow-teal-600/20 active:scale-[0.98]">
                  {heroData.ctaPrimary}
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>

                {/* Secondary CTA */}
                <button className="flex items-center justify-center px-7 py-3.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-teal-600 hover:text-teal-600 hover:bg-teal-50/30 transition-all duration-200">
                  <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  {heroData.ctaSecondary}
                </button>
              </div>

              {/* Integration tags */}
              <div className="flex flex-wrap gap-2.5">
                {heroData.integrations.map((integration, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3.5 py-2 bg-gray-50 rounded-full border border-gray-200 text-sm text-gray-700 font-medium hover:border-teal-200 hover:bg-teal-50/40 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                    {integration}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SECTION - grouped mockup container */}
            <div className="col-span-1 lg:col-span-1 flex justify-center lg:justify-end items-start self-start lg:mt-6">
              <div className="bg-emerald-50/40 rounded-3xl border border-emerald-100 shadow-inner p-8 max-w-2xl space-y-8">
                {[
                  {
                    title: 'Chequeo automático de cumplimiento',
                    icon: ShieldCheck,
                    desc: 'Consulta en segundos el estado de tus obligaciones ante SAT, UIF y CLUNI sin revisar múltiples portales.',
                  },
                  {
                    title: 'Alertas antes de cometer errores',
                    icon: AlertCircle,
                    desc: 'Recibe recordatorios y notificaciones antes de cada vencimiento para evitar omisiones y sanciones.',
                  },
                  {
                    title: 'Archivo digital con retención normativa',
                    icon: FolderArchive,
                    desc: 'Guarda contratos, declaraciones y evidencias por hasta 10 años cumpliendo con la normativa documental.',
                  },
                ].map((card, idx) => {
                  const IconComp = card.icon;
                  const marginClass = idx === 1 ? 'ml-4' : idx === 2 ? 'ml-8' : '';
                  return (
                    <div
                      key={idx}
                      className={`${marginClass} bg-white rounded-xl border border-slate-100 shadow-md p-8`}
                    >
                      <p className="text-lg font-semibold text-gray-900 uppercase">
                        {card.title}
                      </p>
                      <div className="flex items-center mt-3">
                        <IconComp className="w-6 h-6 text-emerald-600 mr-3" strokeWidth={1.5} />
                        <div>
                          <p className="text-base text-gray-700 leading-relaxed">
                            {card.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
