'use client';

import React from 'react';
import { ctaData } from './data';

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-teal-600 to-teal-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Title */}
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">{ctaData.title}</h2>

        {/* Description */}
        <p className="text-xl text-emerald-50 mb-10 leading-relaxed">{ctaData.description}</p>

        {/* CTA Button */}
        <button className="inline-block px-12 py-4 bg-white text-teal-600 font-bold text-lg rounded-lg hover:bg-gray-100 transition-colors shadow-xl mb-8">
          {ctaData.cta}
        </button>

        {/* Features */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8 text-emerald-50">
          {ctaData.features.map((feature, idx) => (
            <div key={idx} className="flex items-center justify-center text-sm">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {feature}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
