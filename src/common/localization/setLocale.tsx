import { setDefaultOptions } from 'date-fns';
import { fi, sv, enUS } from 'date-fns/locale';

export type Locale = 'fi' | 'sv' | 'en';

const locales = {
  fi,
  sv,
  en: enUS,
};

function setLocale(locale: Locale) {
  setDefaultOptions({ locale: locales[locale] });
}

export default setLocale;
