import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import fi from '../translation/i18n/fi.json';

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

export default i18n;
