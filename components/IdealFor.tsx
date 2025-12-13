import React from 'react';
import { useTranslation } from 'react-i18next';

export const IdealFor: React.FC = () => {
  const { t } = useTranslation();

  const idealForList = [
    'idealFor.couples',
    'idealFor.families',
    'idealFor.beachLovers',
    'idealFor.remoteWorkers'
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-sky-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            {t('idealFor.title')}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <ul className="space-y-5">
            {idealForList.map((item, index) => (
              <li key={index} className="flex items-start group">
                <div className="flex-shrink-0 mt-1">
                  <svg
                    className="w-6 h-6 text-sardinia-sea group-hover:scale-110 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="ml-4 text-lg text-gray-700 leading-relaxed">
                  {t(item)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
