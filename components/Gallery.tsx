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
    url: '/terrazzo-1.webp',
    alt: 'Terrazzo panoramico con vista',
    category: 'Esterni'
  },
  {
    url: '/terrazzino-1.webp',
    alt: 'Terrazzo attrezzato per pranzi all\'aperto',
    category: 'Esterni'
  },
  
  // Camere
  {
    url: '/camera-1.webp',
    alt: 'Camera da letto',
    category: 'Camere'
  },
 {
    url: '/camera-2.png',
    alt: 'Camera da letto',
    category: 'Camere'
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

  // Bagno
  {
    url: '/bagno-1.png',
    alt: 'Bagno con piastrelle in ceramica',
    category: 'Bagno'
  }
];

export const Gallery: React.FC = () => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
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

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % filteredImages.length);
    }
  };

  const goToPrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  // Gestione tasti freccia
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            {t('gallery.title')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('gallery.subtitle')}
          </p>
        </div>

        {/* Filtri Categoria */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
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
              onClick={() => openLightbox(index)}
              className="relative group cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-gray-200">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              
              {/* Overlay al hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <svg 
                  className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
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

        {/* Lightbox */}
        {selectedImage !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Pulsante Chiudi */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              className="absolute top-4 right-4 z-[70] p-3 bg-white/20 hover:bg-white/40 rounded-full transition-all shadow-lg"
              aria-label={t('gallery.closeGallery')}
            >
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Freccia Sinistra */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 z-60 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all"
              aria-label={t('gallery.previousImage')}
            >
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Immagine */}
            <div
              className="relative max-w-6xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filteredImages[selectedImage].url}
                alt={filteredImages[selectedImage].alt}
                className="w-full h-full object-contain rounded-lg"
              />
              
              {/* Descrizione */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <p className="text-white text-lg font-medium">
                  {filteredImages[selectedImage].alt}
                </p>
                <p className="text-gray-300 text-sm mt-1">
                  {selectedImage + 1} / {filteredImages.length}
                </p>
              </div>
            </div>

            {/* Freccia Destra */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 z-60 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all"
              aria-label={t('gallery.nextImage')}
            >
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
