import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
          setError(t('calendar.errors.notAccessible'));
        } else if (response.status === 404) {
          setError(t('calendar.errors.notFound'));
        } else {
          setError(t('calendar.errors.generic'));
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
        const hasEvent = events.some((event: any) => {
          const eventStart = event.start.date || event.start.dateTime?.split('T')[0];
          const eventEnd = event.end.date || event.end.dateTime?.split('T')[0];

          // Controlla se la data corrente cade all'interno dell'intervallo dell'evento
          // Per gli eventi all-day, l'end date è esclusivo (es: evento dal 5 al 10 ha end=11)
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
      setError(null);
    } catch (error) {
      console.error('Errore nel caricamento del calendario:', error);
      setError(t('calendar.errors.connection'));
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
    t('calendar.months.0'),
    t('calendar.months.1'),
    t('calendar.months.2'),
    t('calendar.months.3'),
    t('calendar.months.4'),
    t('calendar.months.5'),
    t('calendar.months.6'),
    t('calendar.months.7'),
    t('calendar.months.8'),
    t('calendar.months.9'),
    t('calendar.months.10'),
    t('calendar.months.11')
  ];

  const dayNames = [
    t('calendar.days.mon'),
    t('calendar.days.tue'),
    t('calendar.days.wed'),
    t('calendar.days.thu'),
    t('calendar.days.fri'),
    t('calendar.days.sat'),
    t('calendar.days.sun')
  ];

  return (
    <section id="calendar" className="py-8 md:py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 md:mb-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">{t('calendar.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm">
            {t('calendar.subtitle')}
          </p>
        </div>

        {!GOOGLE_CALENDAR_ID || !GOOGLE_API_KEY ? (
          <div className="bg-gray-100 p-6 rounded-lg text-center text-gray-500 text-sm">
            <p>{t('calendar.notConfigured')}</p>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 max-w-3xl mx-auto">
            {/* Header con navigazione mesi */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => changeMonth(-1)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={t('calendar.previousMonth')}
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <h3 className="text-lg font-semibold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>

              <button
                onClick={() => changeMonth(1)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={t('calendar.nextMonth')}
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Giorni della settimana */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {dayNames.map((day) => (
                <div key={day} className="text-center font-medium text-gray-600 text-xs py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Griglia calendario */}
            {loading ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                {t('calendar.loading')}
              </div>
            ) : error ? (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
                <div className="text-red-700 font-semibold mb-1 text-sm">⚠️ {error}</div>
                <div className="text-red-600 text-xs">
                  {t('calendar.errors.instructions')}
                </div>
              </div>
            ) : calendarDays.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                {t('calendar.noData')}
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    style={{ minHeight: '44px' }}
                    className={`
                      py-2 px-1 flex items-center justify-center rounded text-sm font-semibold
                      ${!day.isCurrentMonth ? 'text-gray-400 opacity-60' : ''}
                      ${day.isOccupied
                        ? 'bg-red-100 text-red-800 border border-red-400'
                        : 'bg-green-100 text-green-800 border border-green-400'
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
            <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                <span className="text-xs text-gray-600">{t('calendar.available')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                <span className="text-xs text-gray-600">{t('calendar.occupied')}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 italic">
            {t('calendar.disclaimer')}
          </p>
        </div>
      </div>
    </section>
  );
};