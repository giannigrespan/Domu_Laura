import React, { useState, useEffect } from 'react';

export const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Array di immagini - le immagini devono essere caricate in /public/images/
  const images = [
    '/images/slide1.jpg',
    '/images/slide2.jpg',
    '/images/slide3.jpg'
  ];

  // Auto-scroll ogni 5 secondi
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div id="home" className="relative h-screen min-h-[600px] flex items-center justify-center bg-gray-900">
      {/* Image Carousel Background */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${image})`,
            filter: 'brightness(0.6)'
          }}
        />
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 z-20 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-all"
        aria-label="Immagine precedente"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 z-20 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-all"
        aria-label="Immagine successiva"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-6 animate-fade-in-up">
          Il tuo angolo di pace in Sardegna
        </h1>
        <p className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto font-light">
          Scopri la bellezza autentica di Torpè. A pochi minuti dal mare cristallino di Posada, immerso nella tranquillità della natura.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#calendar"
            className="px-8 py-3 bg-sardinia-sea hover:bg-sky-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105"
          >
            Verifica Disponibilità
          </a>
          <a
            href="#concierge"
            className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 font-semibold rounded-lg shadow-lg transition-all"
          >
            Chiedi al Concierge AI
          </a>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Vai a immagine ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
