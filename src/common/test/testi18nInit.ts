import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import fi from '../translation/i18n/fi.json';
import setLocale, { Locale } from '../localization/setLocale';

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  lng: 'fi',
  fallbackLng: 'fi',
  resources: {
    fi: {
      translation: fi,
    },
  },
  interpolation: {
    skipOnVariables: false,
  },
});

setLocale(i18n.language as Locale);

export default i18n;
