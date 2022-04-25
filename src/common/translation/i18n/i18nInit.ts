import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { History } from 'history';

import replaceLocaleInPathname from '../../route/utils/replaceLocaleInPathname';
import setLocale, { Locale } from '../../localization/setLocale';
import { SUPPORT_LANGUAGES } from '../TranslationConstants';
import en from './en.json';
import fi from './fi.json';
import sv from './sv.json';

// The language of the application is controlled by LanguageDetector.
// When the language is changed, the application is reloaded. This
// causes i18next to also be re-initialized, which means that
// LanguageDetector is used to detect current language. One criteria is
// the locale specified in the url.

// This means that this file is the best place to keep the language and
// locale of the application in sync. We first initialize i18next, and
// then use the language it determines to be the most appropriate to
// use to set the locale.
export function initI18next(history: History) {
  // Replace language in url so that the pathname will reflect the current
  // language when language is changed by using i18n.changeLanguage
  i18n.on('languageChanged', (nextLanguage) => {
    // If necessary, change language in pathname
    const { pathname, ...rest } = window.location;

    const nextPathname = replaceLocaleInPathname(nextLanguage, pathname);

    if (nextPathname) {
      history.replace({
        ...rest,
        pathname: nextPathname,
      });
    }
  });

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

  setLocale(i18n.language as Locale);
}

export default i18n;
