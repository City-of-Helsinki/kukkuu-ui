import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import fi from '../translation/i18n/fi.json';
import setLocale, { Locale } from '../localization/setLocale';
import {
  cimodePostProcessor,
  CIMODE_POST_PROCESSOR_NAME,
} from '../translation/cimode/cimodePostProcessor';

i18n
  .use(cimodePostProcessor)
  .use(initReactI18next)
  .init({
    postProcess: [CIMODE_POST_PROCESSOR_NAME],
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
