import { i18n as I18nInstanceType } from 'i18next';

import {
  DEFAULT_LANGUAGE,
  Language,
} from './TranslationConstants';

export type { Language };

/**
 * Safety check in case
 * somehow i18n have problem or have empty languages.
 */
export const getCurrentLanguage = (i18n: I18nInstanceType): Language => {
  if (i18n.language && Object.values(i18n.languages).includes(i18n.language)) {
    return i18n.language as Language;
  }
  return DEFAULT_LANGUAGE;
};
