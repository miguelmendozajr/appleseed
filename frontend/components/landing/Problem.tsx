'use client';

import React from 'react';
import {
  Clipboard,
  AlertTriangle,
  FileText,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { problemData } from './data';

interface ProblemCardProps {
  stat: string;
  statLabel: string;
  title: string;
  description: string;
  iconName: string;
  theme: 'yellow' | 'red' | 'blue' | 'purple';
}

// Icon mapping for lucide-react
const IconMap: Record<string, React.ReactNode> = {
  Clipboard: <Clipboard className="w-5 h-5" strokeWidth={2} />,
  AlertTriangle: <AlertTriangle className="w-5 h-5" strokeWidth={2} />,
  FileText: <FileText className="w-5 h-5" strokeWidth={2} />,
  Clock: <Clock className="w-5 h-5" strokeWidth={2} />,
};

const ProblemCard: React.FC<ProblemCardProps> = ({
  stat,
  statLabel,
  title,
  description,
  iconName,
  theme,
}) => {
  const themeStyles = {
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'bg-yellow-100 text-yellow-700',
      stat: 'text-yellow-600',
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'bg-red-100 text-red-700',
      stat: 'text-red-600',
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'bg-blue-100 text-blue-700',
      stat: 'text-blue-600',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      icon: 'bg-purple-100 text-purple-700',
      stat: 'text-purple-600',
    },
  };

  const style = themeStyles[theme];

  return (
    <div
      className={`${style.bg} ${style.border} flex h-full flex-col rounded-2xl border p-6 sm:p-8 transition-all duration-200 hover:shadow-md`}
    >
      {/* Header: Icon + Stat Row */}
      <div className="flex items-start justify-between gap-4 mb-6 sm:mb-8">
        {/* Left: Icon Container */}
        <div
          className={`${style.icon} flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg`}
        >
          {IconMap[iconName]}
        </div>

        {/* Right: Stat Block (aligned to top-right) */}
        <div className="flex flex-col items-end">
          <div className={`${style.stat} text-2xl sm:text-3xl font-bold leading-none`}>
            {stat}
          </div>
          <div className="text-xs sm:text-sm font-medium text-gray-600 mt-1">
            {statLabel}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed flex-grow">
          {description}
        </p>
      </div>
    </div>
  );
};

export default function Problem() {
  return (
    <section
      id="problema"
      className="relative bg-gradient-to-b from-gray-50 via-white to-white py-24 sm:py-32 lg:py-40"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header Section */}
        <div className="mx-auto mb-16 sm:mb-24 lg:mb-28">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 mb-6 sm:mb-8">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" strokeWidth={2} />
            <span className="text-xs sm:text-sm font-semibold text-red-700">
              El panorama actual de las OSC
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight max-w-4xl">
            La gestión de cumplimiento hoy es{' '}
            <span className="text-red-600">insostenible</span>
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
            Las organizaciones de la sociedad civil enfrentan una carga regulatoria
            compleja, dispersa y con consecuencias graves si se gestiona de forma
            deficiente.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          {problemData.problems.map((problem) => (
            <ProblemCard
              key={problem.id}
              stat={problem.stat}
              statLabel={problem.statLabel}
              title={problem.title}
              description={problem.description}
              iconName={problem.icon}
              theme={problem.theme}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
