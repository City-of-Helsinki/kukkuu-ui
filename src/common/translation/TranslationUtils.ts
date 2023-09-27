import { i18n as I18nInstanceType } from 'i18next';

import { SUPPORT_LANGUAGES } from './TranslationConstants';

type Language = 'fi' | 'en' | 'sv';

/**
 * Safety check in case
 * somehow i18n have problem or have empty languages.
 */
export const getCurrentLanguage = (i18n: I18nInstanceType): Language =>
  (i18n && i18n.languages && (i18n.languages[0] as Language)) ||
  SUPPORT_LANGUAGES.FI;
