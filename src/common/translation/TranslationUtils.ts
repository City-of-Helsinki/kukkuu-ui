import { i18n as I18nInstanceType } from 'i18next';

import { SUPPORT_LANGUAGES } from './TranslationConstants';

type Language = 'fi' | 'en' | 'sv';

/**
 * Safety check in case
 * somehow i18n have problem or have empty languages.
 */
export const getCurrentLanguage = (i18n: I18nInstanceType): Language => {
  if (i18n.language && Object.values(i18n.languages).includes(i18n.language)) {
    return i18n.language as Language;
  }
  return SUPPORT_LANGUAGES.FI as Language;
};
