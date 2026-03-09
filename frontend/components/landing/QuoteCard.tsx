'use client';

import React from 'react';

interface QuoteCardProps {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

export default function QuoteCard({ quote, author, role, avatar }: QuoteCardProps) {
  return (
    <div className="bg-gray-50 rounded-xl p-8 shadow-lg">
      <p className="text-gray-700 mb-6 leading-relaxed italic">"{quote}"</p>
      <div className="flex items-center">
        <img
          src={avatar}
          alt={author}
          className="w-12 h-12 rounded-full mr-4 object-cover"
        />
        <div>
          <p className="font-bold text-gray-900">{author}</p>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
      </div>
    </div>
  );
}
