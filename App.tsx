import React, { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { CalendarSection } from './components/CalendarSection';
import { Concierge } from './components/Concierge';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  // Fix per auto-scroll indesiderato al caricamento
  useEffect(() => {
    // Controlla se c'è un hash nell'URL (es. #calendar)
    const hash = window.location.hash;

    // Se non c'è hash, scrolla all'inizio
    if (!hash) {
      window.scrollTo(0, 0);
      // Forza lo scroll anche dopo che tutti i componenti sono caricati
      setTimeout(() => window.scrollTo(0, 0), 0);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <CalendarSection />
        <Concierge />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;