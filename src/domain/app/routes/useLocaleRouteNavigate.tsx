import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';

import { SUPPORT_LANGUAGES } from '../../../common/translation/TranslationConstants';

const isSupportedLocale = (locale?: string) =>
  locale && Object.values(SUPPORT_LANGUAGES).includes(locale);

/**
 * Check that the current pathname starts with a current locale.
 * If the current locale is not set in the pathname as the first segment,
 * the router will navigate to such a route and chagne the location pathname.
 */
export const useLocaleRouteNavigate = () => {
  const {
    i18n: { language: currentLocale },
  } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const match = useMatch('/:locale/*');
  const locale = match?.params?.locale;

  const { i18n } = useTranslation();

  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.info('Change current language to', locale);
    i18n.changeLanguage(locale);
  }, [i18n, locale]);

  React.useEffect(() => {
    const shouldPrefixPathnameWithLocale = !isSupportedLocale(locale);
    if (shouldPrefixPathnameWithLocale) {
      navigate(`/${currentLocale}${location.pathname}${location.search}`, {
        replace: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, currentLocale, locale]);
};
