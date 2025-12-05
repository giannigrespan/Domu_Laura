import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Excursion {
  translationKey: string;
  image: string;
  distance: string;
  category: 'beaches' | 'natureMountain' | 'cultureHistory' | 'activities';
  duration?: string;
}

// Lista delle escursioni e luoghi da visitare - Usa chiavi di traduzione
const EXCURSIONS: Excursion[] = [
  // Spiagge
  {
    translationKey: 'excursions.places.calaGoloritze',
    image: '/calagoloritze.jpg',
    distance: '50 km',
    category: 'beaches',
    duration: '1 ora'
  },
  {
    translationKey: 'excursions.places.berchida',
    image: '/berchida.jpg',
    distance: '12 km',
    category: 'beaches',
    duration: '18 min'
  },
  {
    translationKey: 'excursions.places.calaBrandinchi',
    image: '/Cala-Brandinchi.webp',
    distance: '14 km',
    category: 'beaches',
    duration: '20 min'
  },
  {
    translationKey: 'excursions.places.laCinta',
    image: '/lacinta1.jpg',
    distance: '10 km',
    category: 'beaches',
    duration: '15 min'
  },

  // Cultura e Storia
  {
    translationKey: 'excursions.places.nuragheLoelle',
    image: '/loelle.jpg',
    distance: '15 km',
    category: 'cultureHistory',
    duration: '20 min'
  },

  // Attività
  {
    translationKey: 'excursions.places.gorropu',
    image: '/gorroppu.jpg',
    distance: '60 km',
    category: 'activities',
    duration: '1h 15min'
  }
];

export const Excursions: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Estrai categorie uniche
  const uniqueCategories = Array.from(new Set(EXCURSIONS.map(exc => exc.category)));
  const categories = ['all', ...uniqueCategories];

  // Filtra escursioni per categoria
  const filteredExcursions = selectedCategory === 'all'
    ? EXCURSIONS
    : EXCURSIONS.filter(exc => exc.category === selectedCategory);

  return (
    <section id="excursions" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            {t('excursions.title')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('excursions.subtitle')}
          </p>
        </div>

        {/* Filtri Categoria */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-sardinia-sea text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-200'
              }`}
            >
              {t(`excursions.categories.${category}`)}
            </button>
          ))}
        </div>

        {/* Griglia Escursioni */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredExcursions.map((excursion, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Immagine */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={excursion.image}
                  alt={t(`${excursion.translationKey}.name`)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Badge Categoria */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-xs font-bold text-sardinia-sea uppercase tracking-wide">
                    {t(`excursions.categories.${excursion.category}`)}
                  </span>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Contenuto */}
              <div className="p-6">
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">
                  {t(`${excursion.translationKey}.name`)}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {t(`${excursion.translationKey}.description`)}
                </p>

                {/* Info Bottom */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center text-gray-500">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-medium">{excursion.distance}</span>
                  </div>

                  {excursion.duration && (
                    <div className="flex items-center text-gray-500">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium">{excursion.duration}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-16 bg-sardinia-sea/5 border border-sardinia-sea/20 rounded-2xl p-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-sardinia-sea" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('excursions.excursionTips')}
              </h3>
              <p
                className="text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t('excursions.excursionTipsText') }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
