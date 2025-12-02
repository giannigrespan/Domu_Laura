import React, { useState } from 'react';

interface Excursion {
  name: string;
  description: string;
  image: string;
  distance: string;
  category: string;
  duration?: string;
}

// Lista delle escursioni e luoghi da visitare - Sostituisci con le tue immagini reali
const EXCURSIONS: Excursion[] = [
  // Spiagge
  {
    name: 'Spiaggia di Cala Goloritzè',
    description: 'L’incontaminata e selvaggia Cala Goloritzé, testimonial di Baunei, è uno dei tratti costieri del golfo di Orosei dove mare e montagna si incontrano in perfetta armonia.',
    image: '/calagoloritze.jpg',
    distance: '50 km',
    category: 'Spiagge',
    duration: '1 ora'
  },
  {
    name: 'Spiaggia di Cala Ginepro',
    description: 'Una delle spiagge più belle della zona, con sabbia bianca finissima e mare cristallino. Ideale per famiglie e sport acquatici.',
    image: '/cala ginepro.jpg',
    distance: '15 km',
    category: 'Spiagge',
    duration: '20 min'
  },
  {
    name: 'Spiaggia di Berchida',
    description: 'Spiaggia incontaminata circondata da dune e ginepri, perfetta per chi cerca tranquillità e natura selvaggia.',
    image: '/berchida.jpg',
    distance: '12 km',
    category: 'Spiagge',
    duration: '18 min'
  },
  {
    name: 'Cala Liberotto',
    description: 'Piccola baia con acque turchesi e scogli pittoreschi. Ottima per snorkeling e immersioni.',
    image: '/liberotto.jpg',
    distance: '18 km',
    category: 'Spiagge',
    duration: '25 min'
  },
  {
    name: 'Spiaggia di Orosei',
    description: 'Lunga spiaggia di sabbia dorata con tutti i servizi, ristoranti e stabilimenti balneari.',
    image: '/orosei.jpg',
    distance: '20 km',
    category: 'Spiagge',
    duration: '25 min'
  },

  // Natura e Montagna
  {
    name: 'Monte Albo',
    description: 'Massiccio calcareo con sentieri panoramici e vista mozzafiato sulla costa orientale. Trekking di vari livelli di difficoltà.',
    image: '/albo.jpg',
    distance: '8 km',
    category: 'Natura e Montagna',
    duration: '15 min'
  },
  {
    name: 'Grotte di Monte Albo',
    description: 'Sistema di grotte naturali con formazioni rocciose spettacolari. Visite guidate disponibili.',
    image: '/cava ispica.jpg',
    distance: '10 km',
    category: 'Natura e Montagna',
    duration: '15 min'
  },
  {
    name: 'Foresta di Sos Nibberos',
    description: 'Foresta secolare di lecci e sughere, perfetta per passeggiate naturalistiche e birdwatching.',
    image: '/niberros.jpg',
    distance: '25 km',
    category: 'Natura e Montagna',
    duration: '30 min'
  },

  // Cultura e Storia
  {
    name: 'Centro Storico di Orosei',
    description: 'Borgo medievale con chiese storiche, piazze caratteristiche e architettura tradizionale sarda.',
    image: '/orosei citta.jpg',
    distance: '20 km',
    category: 'Cultura e Storia',
    duration: '25 min'
  },
  {
    name: 'Nuraghe di Loelle',
    description: 'Sito archeologico nuragico ben conservato, testimonianza dell\'antica civiltà sarda.',
    image: '/loelle.jpg',
    distance: '15 km',
    category: 'Cultura e Storia',
    duration: '20 min'
  },
  {
    name: 'Chiesa di San Pietro a Torpè',
    description: 'Antica chiesa romanica del XII secolo con affreschi e architettura tipica del periodo.',
    image: '/nuraghe.jpg',
    distance: '2 km',
    category: 'Cultura e Storia',
    duration: '5 min'
  },

  // Attività
  {
    name: 'Giro in Barca a Cala Luna',
    description: 'Escursione in barca alle famose calette del Golfo di Orosei, con possibilità di snorkeling.',
    image: '/cala luna.jpg',
    distance: '25 km (porto)',
    category: 'Attività',
    duration: 'Giornata intera'
  },
  {
    name: 'Trekking Gola di Gorropu',
    description: 'Uno dei canyon più profondi d\'Europa. Esperienza indimenticabile per amanti del trekking.',
    image: '/gorroppu.jpg',
    distance: '60 km',
    category: 'Attività',
    duration: '1h 15min'
  }
];

export const Excursions: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tutte');

  // Estrai categorie uniche
  const categories = ['Tutte', ...Array.from(new Set(EXCURSIONS.map(exc => exc.category)))];

  // Filtra escursioni per categoria
  const filteredExcursions = selectedCategory === 'Tutte'
    ? EXCURSIONS
    : EXCURSIONS.filter(exc => exc.category === selectedCategory);

  return (
    <section id="excursions" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            Escursioni e Luoghi da Visitare
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Scopri le meraviglie della Sardegna orientale. Spiagge paradisiache,
            montagne mozzafiato e tesori culturali ti aspettano a pochi chilometri da casa.
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
              {category}
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
                  alt={excursion.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Badge Categoria */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-xs font-bold text-sardinia-sea uppercase tracking-wide">
                    {excursion.category}
                  </span>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Contenuto */}
              <div className="p-6">
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">
                  {excursion.name}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {excursion.description}
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
                Consigli per le tue escursioni
              </h3>
              <p className="text-gray-600 leading-relaxed">
                La nostra assistente AI <strong>Concierge</strong> può fornirti informazioni dettagliate
                su orari, prenotazioni e consigli personalizzati per ogni destinazione.
                Non esitare a contattarci per organizzare la tua esperienza perfetta!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
