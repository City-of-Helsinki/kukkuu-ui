import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import setLocale, { Locale } from '../../localization/setLocale';
import en from './en.json';
import fi from './fi.json';
import sv from './sv.json';
import { SUPPORT_LANGUAGES } from '../TranslationConstants';

// The language of the application is controlled by LanguageDetector.
// When the language is changed, the application is reloaded. This
// causes i18next to also be re-initialized, which means that
// LanguageDetector is used to detect current language. One criteria is
// the locale specified in the url.

// This means that this file is the best place to keep the language and
// locale of the application in sync. We first initialize i18next, and
// then use the language it determines to be the most appropriate to
// use to set the locale.
function initI18next() {
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
      fallbackLng: 'fi',
      interpolation: {
        escapeValue: false,
        skipOnVariables: false,
      },
      supportedLngs: [
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
  const language = i18n.language as Locale;

  setLocale(language);
}

initI18next();

export default i18n;
