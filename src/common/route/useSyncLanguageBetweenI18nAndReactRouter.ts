import { useEffect } from 'react';
import { useMatch } from 'react-router';
import { useTranslation } from 'react-i18next';

import { SUPPORT_LANGUAGES } from '../../common/translation/TranslationConstants';
import { localeParam } from '../../domain/app/appRoutes';

function persistLanguageChoice(language: string) {
  document.cookie = `i18next=${language}; SameSite=Strict; path=/`;
}

export default function useSyncLanguageBetweenI18nAndReactRouter() {
  const { i18n } = useTranslation();
  const localeMatch = useMatch(`/${localeParam}`);
  const locale = localeMatch?.params?.locale ?? SUPPORT_LANGUAGES.FI;

  useEffect(() => {
    if (locale && locale !== i18n.language) {
      i18n.changeLanguage(locale);
      persistLanguageChoice(locale);
    }
  }, [locale, i18n]);
}
