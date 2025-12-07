import React from 'react';
import { useTranslation } from 'react-i18next';

export const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div id="home" className="relative h-screen min-h-[400px] md:min-h-[600px] flex items-center justify-center bg-gray-900">
      {/* Single Background Image with Fade Effect */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center animate-fade-in"
        style={{
          backgroundImage: `url(/Cala-Brandinchi.webp)`,
          filter: 'brightness(0.6)'
        }}
      />

      {/* Gradient Overlay for Better Text Readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-6 animate-fade-in-up">
          {t('hero.title')}
        </h1>
        <p className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto font-light">
          {t('hero.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#calendar"
            className="px-8 py-3 bg-sardinia-sea hover:bg-sky-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105"
          >
            {t('hero.checkAvailability')}
          </a>
          <a
            href="#concierge"
            className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 font-semibold rounded-lg shadow-lg transition-all"
          >
            {t('hero.askAssistant')}
          </a>
        </div>
      </div>

      {/* Scroll Down Arrow */}
      <a
        href="#features"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce cursor-pointer group"
        aria-label={t('hero.scrollDown')}
      >
        <div className="flex flex-col items-center">
          <svg
            className="w-12 h-12 text-white drop-shadow-lg group-hover:text-gray-200 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7-7-7" />
          </svg>
        </div>
      </a>
    </div>
  );
};
