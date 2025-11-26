import React, { useState, useEffect } from 'react';

// L'ID del calendario viene caricato dalle variabili d'ambiente di Vercel
// Le variabili sono esposte tramite process.env attraverso vite.config.ts
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

interface CalendarDay {
  date: Date;
  isOccupied: boolean;
  isCurrentMonth: boolean;
}

export const CalendarSection: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCalendarData();
  }, [currentDate]);

  const fetchCalendarData = async () => {
    if (!GOOGLE_CALENDAR_ID || !GOOGLE_API_KEY) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      // Primo e ultimo giorno del mese
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      // Calcola il primo giorno da mostrare (lunedì della settimana del primo giorno del mese)
      const startDate = new Date(firstDay);
      const firstDayOfWeek = firstDay.getDay(); // 0 = domenica, 1 = lunedì, ...
      const daysToSubtract = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Lunedì come primo giorno
      startDate.setDate(firstDay.getDate() - daysToSubtract);

      // Calcola l'ultimo giorno da mostrare (domenica della settimana dell'ultimo giorno del mese)
      const endDate = new Date(lastDay);
      const lastDayOfWeek = lastDay.getDay();
      const daysToAdd = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
      endDate.setDate(lastDay.getDate() + daysToAdd);

      // Fetch eventi da Google Calendar
      const timeMin = startDate.toISOString();
      const timeMax = endDate.toISOString();

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/events?` +
        `key=${GOOGLE_API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`
      );

      if (!response.ok) {
        if (response.status === 403) {
          setError('Il calendario non è accessibile. Assicurati che sia pubblico.');
        } else if (response.status === 404) {
          setError('Calendario non trovato. Verifica l\'ID del calendario.');
        } else {
          setError('Errore nel caricamento del calendario. Riprova più tardi.');
        }
        setCalendarDays([]);
        return;
      }

      const data = await response.json();
      const events = data.items || [];

      // Crea array di giorni con stato occupato/libero
      const days: CalendarDay[] = [];
      const currentDateIter = new Date(startDate);

      while (currentDateIter <= endDate) {
        const dateStr = currentDateIter.toISOString().split('T')[0];

        // Controlla se il giorno corrente è occupato da almeno un evento
        const hasEvent = events.some((event: any) => {
          // Data di inizio evento
          const eventStartStr = event.start.date || event.start.dateTime?.split('T')[0];
          const eventStart = new Date(eventStartStr);

          // Data di fine evento
          // Per eventi "all-day", la data di fine è esclusiva (es: evento 6-8 ha end = 9)
          const eventEndStr = event.end.date || event.end.dateTime?.split('T')[0];
          const eventEnd = new Date(eventEndStr);

          // Per eventi all-day, sottrai un giorno dalla data di fine
          if (event.start.date) {
            eventEnd.setDate(eventEnd.getDate() - 1);
          }

          const currentDay = new Date(dateStr);

          // Controlla se currentDay è compreso tra eventStart e eventEnd (inclusi)
          return currentDay >= eventStart && currentDay <= eventEnd;
        });

        days.push({
          date: new Date(currentDateIter),
          isOccupied: hasEvent,
          isCurrentMonth: currentDateIter.getMonth() === month
        });

        currentDateIter.setDate(currentDateIter.getDate() + 1);
      }

      setCalendarDays(days);
      setError(null);
    } catch (error) {
      console.error('Errore nel caricamento del calendario:', error);
      setError('Errore di connessione. Verifica la configurazione.');
      setCalendarDays([]);
    } finally {
      setLoading(false);
    }
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  const monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  const dayNames = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

  return (
    <section id="calendar" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Verifica Disponibilità</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Consulta il calendario per vedere i giorni liberi. I giorni in verde sono liberi, quelli in rosso sono occupati.
            Contattaci direttamente per confermare la tua prenotazione.
          </p>
        </div>

        {!GOOGLE_CALENDAR_ID || !GOOGLE_API_KEY ? (
          <div className="bg-gray-100 p-8 rounded-xl text-center text-gray-500">
            <p>Calendario non configurato. Verifica le variabili d'ambiente (GOOGLE_CALENDAR_ID e GOOGLE_API_KEY).</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 max-w-4xl mx-auto">
            {/* Header con navigazione mesi */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => changeMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Mese precedente"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <h3 className="text-2xl font-semibold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>

              <button
                onClick={() => changeMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Mese successivo"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Giorni della settimana */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="text-center font-medium text-gray-600 text-sm py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Griglia calendario */}
            {loading ? (
              <div className="text-center py-12 text-gray-500">
                Caricamento...
              </div>
            ) : error ? (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
                <div className="text-red-700 font-semibold mb-2">⚠️ {error}</div>
                <div className="text-red-600 text-sm">
                  Per risolvere, segui le istruzioni di configurazione fornite dal supporto.
                </div>
              </div>
            ) : calendarDays.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Nessun dato disponibile
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-2 sm:gap-3">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    style={{ minHeight: '64px' }}
                    className={`
                      py-4 px-2 flex items-center justify-center rounded-lg text-lg font-semibold
                      ${!day.isCurrentMonth ? 'text-gray-400 opacity-60' : ''}
                      ${day.isOccupied
                        ? 'bg-red-100 text-red-800 border-2 border-red-400'
                        : 'bg-green-100 text-green-800 border-2 border-green-400'
                      }
                      ${!day.isCurrentMonth && day.isOccupied ? 'bg-red-50 border-red-300' : ''}
                      ${!day.isCurrentMonth && !day.isOccupied ? 'bg-green-50 border-green-300' : ''}
                    `}
                  >
                    {day.date.getDate()}
                  </div>
                ))}
              </div>
            )}

            {/* Legenda */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 border-2 border-green-300 rounded"></div>
                <span className="text-sm text-gray-600">Libero</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-100 border-2 border-red-300 rounded"></div>
                <span className="text-sm text-gray-600">Occupato</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 italic">
            * Il calendario è aggiornato periodicamente. Per la certezza assoluta, invia una richiesta.
          </p>
        </div>
      </div>
    </section>
  );
};