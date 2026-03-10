'use client';

import React from 'react';
import { navLinks } from './data';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-3xl font-bold">
              <span className="text-[#4A6B6D]">Apple</span>
              <span className="text-[#8BC34A]">seed</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
