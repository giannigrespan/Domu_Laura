import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface GalleryImage {
  url: string;
  alt: string;
  category?: string;
}

// Mapping from Italian category names to translation keys
const CATEGORY_TRANSLATION_KEYS: Record<string, string> = {
  'Esterni': 'gallery.categories.exteriors',
  'Camere': 'gallery.categories.bedrooms',
  'Cucina e Soggiorno': 'gallery.categories.kitchenLiving',
  'Bagno': 'gallery.categories.bathroom'
};

// Array di immagini - Foto reali della casa
const GALLERY_IMAGES: GalleryImage[] = [
  // Esterni
  {
    url: '/esterno-cortile.webp',
    alt: 'Ingresso del residence con cancello',
    category: 'Esterni'
  },
  {
    url: '/Albero_web.jpg',
    alt: 'interno con ulivo',
    category: 'Esterni'
  },
  {
    url: '/terrazzo-1.webp',
    alt: 'Terrazzo panoramico con vista',
    category: 'Esterni'
  },
  {
    url: '/terrazzino-1.webp',
    alt: 'Terrazzo attrezzato per pranzi all\'aperto',
    category: 'Esterni'
  },
  
  // Cucina e Soggiorno
  {
    url: '/cucina-1.webp',
    alt: 'Cucina attrezzata',
    category: 'Cucina e Soggiorno'
  },
  {
    url: '/cucina-2.webp',
    alt: 'Zona cucina con dettagli',
    category: 'Cucina e Soggiorno'
  },
  
  // Camere
  {
    url: '/camera-1.webp',
    alt: 'Camera da letto',
    category: 'Camere'
  },
 {
    url: '/camera2.jpg',
    alt: 'Camera da letto',
    category: 'Camere'
  },

  

  // Bagno
  {
    url: '/bagno-1.png',
    alt: 'Bagno con piastrelle in ceramica',
    category: 'Bagno'
  }
];

export const Gallery: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('Tutte');

  // Helper function to translate category names
  const translateCategory = (category: string): string => {
    if (category === 'Tutte') {
      return t('gallery.categories.all');
    }
    return t(CATEGORY_TRANSLATION_KEYS[category] || category);
  };

  // Estrai categorie uniche
  const categories = ['Tutte', ...Array.from(new Set(GALLERY_IMAGES.map(img => img.category).filter((cat): cat is string => Boolean(cat))))];

  // Filtra immagini per categoria
  const filteredImages = selectedCategory === 'Tutte'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter(img => img.category === selectedCategory);

  return (
    <section id="gallery" className="py-10 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            {t('gallery.title')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('gallery.subtitle')}
          </p>
        </div>

        {/* Filtri Categoria */}
        <div className="flex flex-wrap justify-center gap-3 mb-6 md:mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-sardinia-sea text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {translateCategory(category)}
            </button>
          ))}
        </div>

        {/* Griglia Immagini */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-gray-200">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              {/* Label categoria */}
              {image.category && (
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                  {translateCategory(image.category)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
