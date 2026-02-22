import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Caricamento variabili d'ambiente
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

interface CalendarDay {
  date: Date;
  isOccupied: boolean;
  isCurrentMonth: boolean;
}

export const CalendarSection: React.FC = () => {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCalendarData();
  }, [currentDate]);

  // Funzione helper per formattare la data come YYYY-MM-DD senza offset UTC
  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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

      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      // Calcolo inizio (Lunedì) e fine (Domenica) della griglia visibile
      const startDate = new Date(firstDay);
      const firstDayOfWeek = firstDay.getDay(); 
      const daysToSubtract = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
      startDate.setDate(firstDay.getDate() - daysToSubtract);

      const endDate = new Date(lastDay);
      const lastDayOfWeek = lastDay.getDay();
      const daysToAdd = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
      endDate.setDate(lastDay.getDate() + daysToAdd);

      // Fetch da Google Calendar
      const timeMin = startDate.toISOString();
      const timeMax = endDate.toISOString();

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/events?` +
        `key=${GOOGLE_API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`
      );

      if (!response.ok) {
        if (response.status === 403) setError(t('calendar.errors.notAccessible'));
        else if (response.status === 404) setError(t('calendar.errors.notFound'));
        else setError(t('calendar.errors.generic'));
        setCalendarDays([]);
        return;
      }

      const data = await response.json();
      const events = data.items || [];

      const days: CalendarDay[] = [];
      const currentDateIter = new Date(startDate);
      // Reset ore per evitare problemi di calcolo
      currentDateIter.setHours(0, 0, 0, 0);

      while (currentDateIter <= endDate) {
        const dateStr = formatLocalDate(currentDateIter);
        
        const hasEvent = events.some((event: any) => {
          // Gestione date Google: .date per tutto il giorno, .dateTime per orari specifici
          const eventStart = event.start.date || event.start.dateTime?.split('T')[0];
          const eventEnd = event.end.date || event.end.dateTime?.split('T')[0];

          // Se è un evento di un solo giorno (all-day), Google mette l'End Date al giorno dopo.
          // Il confronto 'dateStr < eventEnd' gestisce correttamente l'esclusività del giorno finale.
          return dateStr >= eventStart && dateStr < eventEnd;
        });

        days.push({
          date: new Date(currentDateIter),
          isOccupied: hasEvent,
          isCurrentMonth: currentDateIter.getMonth() === month
        });

        currentDateIter.setDate(currentDateIter.getDate() + 1);
      }

      setCalendarDays(days);
    } catch (err) {
      console.error('Errore caricamento:', err);
      setError(t('calendar.errors.connection'));
    } finally {
      setLoading(false);
    }
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  };

  const monthNames = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(m => t(`calendar.months.${m}`));
  const dayNames = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(d => t(`calendar.days.${d}`));

  return (
    <section id="calendar" className="py-8 md:py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">{t('calendar.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm">{t('calendar.subtitle')}</p>
        </div>

        {!GOOGLE_CALENDAR_ID || !GOOGLE_API_KEY ? (
          <div className="bg-gray-100 p-6 rounded-lg text-center text-gray-500 text-sm">
            <p>{t('calendar.notConfigured')}</p>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 max-w-3xl mx-auto">
            {/* Navigazione */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 className="text-lg font-semibold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Giorni Settimana */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {dayNames.map((day) => (
                <div key={day} className="text-center font-medium text-gray-600 text-xs py-1 uppercase">
                  {day}
                </div>
              ))}
            </div>

            {/* Griglia Calendario */}
            {loading ? (
              <div className="text-center py-12 text-gray-500 text-sm">{t('calendar.loading')}</div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <div className="text-red-700 font-semibold mb-1 text-sm">⚠️ {error}</div>
                <div className="text-red-600 text-xs">{t('calendar.errors.instructions')}</div>
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    style={{ minHeight: '44px' }}
                    className={`
                      py-2 px-1 flex items-center justify-center rounded text-sm font-semibold
                      ${!day.isCurrentMonth ? 'opacity-40' : ''}
                      ${day.isOccupied
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-green-100 text-green-800 border border-green-300'
                      }
                    `}
                  >
                    {day.date.getDate()}
                  </div>
                ))}
              </div>
            )}

            {/* Legenda */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded-sm"></div>
                <span className="text-xs text-gray-600">{t('calendar.available')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-100 border border-red-300 rounded-sm"></div>
                <span className="text-xs text-gray-600">{t('calendar.occupied')}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 italic">{t('calendar.disclaimer')}</p>
        </div>
      </div>
    </section>
  );
};
