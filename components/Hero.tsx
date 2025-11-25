import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div id="home" className="relative h-screen min-h-[600px] flex items-center justify-center bg-gray-900">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          // Updated to a Mediterranean/Sardinia coastal vibe image
          backgroundImage: 'url("https://images.unsplash.com/photo-1548805908-1c2eb2245b9b?q=80&w=2070&auto=format&fit=crop")',
          filter: 'brightness(0.6)'
        }}
      >
      </div>

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
      </div>
    </div>
  );
};