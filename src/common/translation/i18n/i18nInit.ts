import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.json';
import fi from './fi.json';
import sv from './sv.json';
import { SUPPORT_LANGUAGES } from '../TranslationConstants';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: {
      order: [
        'path',
        'querystring',
        'cookie',
        'localStorage',
        'navigator',
        'htmlTag',
        'subdomain',
      ],
    },
    lng: 'fi',
    fallbackLng: 'fi',
    interpolation: {
      escapeValue: false,
    },
    whitelist: [
      SUPPORT_LANGUAGES.EN,
      SUPPORT_LANGUAGES.FI,
      SUPPORT_LANGUAGES.SV,
    ],
    resources: {
      en: {
        translation: en,
      },
      fi: {
        translation: fi,
      },
      sv: {
        translation: sv,
      },
    },
  });

export default i18n;
