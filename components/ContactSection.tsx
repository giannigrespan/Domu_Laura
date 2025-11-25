import React, { useState } from 'react';

export const ContactSection: React.FC = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle');

  // Variabili caricate dall'ambiente (Vercel)
  const TELEGRAM_LINK = process.env.TELEGRAM_LINK || "";
  const FORMSPREE_ENDPOINT = process.env.FORMSPREE_ENDPOINT || "";

  const handleTelegramClick = (e: React.MouseEvent) => {
    if (!TELEGRAM_LINK) {
      e.preventDefault();
      alert("⚠️ Configurazione Mancante\n\nLink Telegram non trovato nelle variabili d'ambiente.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Controllo di sicurezza
    if (!FORMSPREE_ENDPOINT) {
      alert("⚠️ Configurazione Mancante\n\nEndpoint Formspree non trovato nelle variabili d'ambiente.");
      return;
    }

    setFormStatus('submitting');

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setFormStatus('submitted');
        form.reset();
        // Reset messaggio dopo 5 secondi
        setTimeout(() => setFormStatus('idle'), 5000);
      } else {
        const json = await response.json().catch(() => null);
        console.error("Formspree error:", json);
        setFormStatus('error');
      }
    } catch (error) {
      console.error("Network error:", error);
      setFormStatus('error');
    }
  };

  return (
    <section id="contact" className="py-20 bg-sardinia-sand/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          
          {/* Contact Info & Telegram */}
          <div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Contattaci</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Siamo a tua disposizione per qualsiasi informazione. Prenota ora la tua vacanza da sogno a Torpè.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-sardinia-sea rounded-full flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Indirizzo</h4>
                  <p className="text-gray-600">Via Roma 123, 08020 Torpè (NU)</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-sardinia-sea rounded-full flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Email</h4>
                  <p className="text-gray-600">info@casavacanzetorpe.it</p>
                </div>
              </div>
            </div>

            {/* Telegram CTA */}
            <div className="mt-10 p-6 bg-white rounded-xl shadow-md border border-blue-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Chatta su Telegram</h3>
              <p className="text-gray-600 mb-4">
                Preferisci una risposta immediata? Scrivi al nostro bot Telegram per info rapide.
              </p>
              <a 
                href={TELEGRAM_LINK}
                target="_blank" 
                rel="noopener noreferrer"
                onClick={handleTelegramClick}
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-[#0088cc] hover:bg-[#007dbb] text-white font-semibold rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Apri Telegram Chatbot
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Invia una richiesta</h3>
            
            {formStatus === 'submitted' ? (
              <div className="bg-green-50 text-green-700 p-6 rounded-lg text-center border border-green-200 animate-fade-in-up">
                <svg className="w-12 h-12 mx-auto mb-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-bold text-lg">Messaggio inviato con successo!</p>
                <p className="text-sm mt-1">Ti risponderemo via email il prima possibile.</p>
              </div>
            ) : formStatus === 'error' ? (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center border border-red-200 mb-6">
                <p className="font-bold">Errore nell'invio.</p>
                <p className="text-sm">Assicurati che la configurazione Formspree sia corretta e riprova.</p>
                <button 
                  onClick={() => setFormStatus('idle')}
                  className="mt-2 text-sm underline hover:text-red-800"
                >
                  Riprova
                </button>
              </div>
            ) : null}

            {formStatus !== 'submitted' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Anti-spam honeypot (campo invisibile per bot) */}
                <input type="text" name="_gotcha" style={{ display: 'none' }} />

                {/* Opzionali: personalizza oggetto email o risposta */}
                <input type="hidden" name="_subject" value="Nuova richiesta prenotazione" />
                <input type="hidden" name="_language" value="it" />

                <div>
                  <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                  <input required name="nome_completo" type="text" id="fullname" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sardinia-sea focus:border-transparent outline-none transition-all" placeholder="Mario Rossi" />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input required name="email" type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sardinia-sea focus:border-transparent outline-none transition-all" placeholder="mario@esempio.com" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="checkin" className="block text-sm font-medium text-gray-700 mb-1">Data Check-in</label>
                    <input name="data_checkin" type="date" id="checkin" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sardinia-sea focus:border-transparent outline-none transition-all" />
                  </div>
                  <div>
                    <label htmlFor="checkout" className="block text-sm font-medium text-gray-700 mb-1">Data Check-out</label>
                    <input name="data_checkout" type="date" id="checkout" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sardinia-sea focus:border-transparent outline-none transition-all" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Messaggio</label>
                  <textarea required name="messaggio" id="message" rows={5} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sardinia-sea focus:border-transparent outline-none transition-all" placeholder="Richieste, note, numero ospiti..."></textarea>
                </div>
                
                <button 
                  type="submit" 
                  disabled={formStatus === 'submitting'}
                  className="w-full bg-gray-900 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {formStatus === 'submitting' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Invio in corso...
                    </>
                  ) : (
                    'Invia'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};