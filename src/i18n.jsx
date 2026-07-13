import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import mkTranslations from './locales/mk.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: enTranslations,
      mk: mkTranslations,
    },
    lng: localStorage.getItem('app_lang') || 'en', // Persist choice across refreshes
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safeguards against XSS
    },
  });

export default i18n;