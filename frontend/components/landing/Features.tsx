'use client';

import React from 'react';
import { featuresData } from './data';
// icons are referenced in data.ts as components, so no need to import them here

export default function Features() {
  return (
    <section id="solucion" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {featuresData.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {featuresData.subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {featuresData.features.map((feature) => (
            <div key={feature.id} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              {/* Badge */}
              {feature.badge && (
                <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full mb-4">
                  {feature.badge}
                </div>
              )}

              {/* Icon container */}
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-50 mb-6 mx-auto">
                <feature.icon className="w-8 h-8 text-slate-600" strokeWidth={1.75} />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">{feature.description}</p>

              {/* Highlights */}
              <ul className="space-y-3 border-t border-gray-200 pt-6">
                {feature.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-700">
                    <svg className="w-4 h-4 text-teal-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
