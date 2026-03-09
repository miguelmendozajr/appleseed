'use client';

import React from 'react';
import { benefitsData, testimonialsData } from './data';
import QuoteCard from './QuoteCard';
import { Lock } from 'lucide-react';

export default function Benefits() {
  return (
    <section id="beneficios" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {benefitsData.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {benefitsData.subtitle}
          </p>
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefitsData.results.map((result) => (
            <div key={result.id} className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-50 mx-auto mb-4">
                <result.icon className="w-8 h-8 text-emerald-600" strokeWidth={1.75} />
              </div>
              <div className="text-4xl font-bold text-teal-600 mb-2">{result.stat}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{result.title}</h3>
              <p className="text-sm text-gray-600">{result.description}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="border-t border-gray-200 pt-16">
          <div className="grid md:grid-cols-2 gap-8">
            {testimonialsData.map((testimonial) => (
              <QuoteCard
                key={testimonial.id}
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
                avatar={testimonial.avatar}
              />
            ))}
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
            <Lock className="w-4 h-4 inline" strokeWidth={1.5} /> Datos cifrados · Sin contratos de permanencia · Cancela cuando quieras
          </p>
        </div>
      </div>
    </section>
  );
}
