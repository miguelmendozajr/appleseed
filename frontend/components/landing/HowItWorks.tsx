'use client';

import React from 'react';
import { howItWorksData } from './data';

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {howItWorksData.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {howItWorksData.subtitle}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {howItWorksData.steps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-teal-600 hover:shadow-xl transition-shadow"
            >
              {/* Step Number */}
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-teal-600">{step.number}</span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">{step.description}</p>

              {/* Features List */}
              <ul className="space-y-2">
                {step.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-700">
                    <svg className="w-4 h-4 text-teal-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button className="px-10 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-lg">
            Agendar una demo gratuita →
          </button>
          <p className="text-sm text-gray-500 mt-4">Sin tarjeta de crédito · Demo personalizada 30 min</p>
        </div>
      </div>
    </section>
  );
}
