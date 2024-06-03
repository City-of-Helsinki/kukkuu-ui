import { useCallback } from 'react';
import { Navigation as RHHCNavigation } from 'react-helsinki-headless-cms/apollo';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Language,
  LanguageCodeEnum,
  MenuItem,
} from 'react-helsinki-headless-cms';

import { SUPPORT_LANGUAGES } from '../../../common/translation/TranslationConstants';
import UserNavigation from './UserNavigation';
import { useCmsLanguageOptions } from '../../../hooks/useCmsLanguageOptions';
import { stripLocaleFromUri } from '../../../utils/cmsUtils';
import useStaticLinks from '../useStaticLinks';

const languageToMenuNameMap = {
  [SUPPORT_LANGUAGES.FI]: 'Main Navigation FI',
  [SUPPORT_LANGUAGES.SV]: 'Main Navigation SV',
  [SUPPORT_LANGUAGES.EN]: 'Main Navigation EN',
} as const;

function Navigation() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const cmsLanguageOptions = useCmsLanguageOptions();
  const staticMenuItems = useStaticLinks();

  const getHref = useCallback(
    (language: LanguageCodeEnum) => {
      const nav = cmsLanguageOptions?.find((cmsLanguageOption) => {
        return (
          cmsLanguageOption.locale?.toLowerCase() === language.toLowerCase()
        );
      });
      const strippedPathname = stripLocaleFromUri(location.pathname);
      // special logic for static urls
      if (strippedPathname) {
        const staticUrl = staticMenuItems.find((menuItem) => {
          return menuItem.slug?.startsWith(strippedPathname);
        });
        if (staticUrl) {
          return `/${language.toLowerCase()}${staticUrl.slug ?? ''}`;
        }
      }

      return `/${language.toLowerCase()}${
        strippedPathname ? stripLocaleFromUri(nav?.uri ?? '') : ''
      }`;
    },
    [cmsLanguageOptions, location.pathname, staticMenuItems]
  );

  const getPathnameForLanguage = (language: Language): string => {
    const languageCode = language.code ?? LanguageCodeEnum.Fi;
    return getHref(languageCode);
  };

  const getIsItemActive = (menuItem: MenuItem): boolean => {
    const pathWithoutTrailingSlash = (menuItem.path ?? '').replace(/\/$/, '');
    return window.location.pathname.includes(
      `/${i18n.language}${stripLocaleFromUri(pathWithoutTrailingSlash)}`
    );
  };

  return (
    <RHHCNavigation
      menuName={
        languageToMenuNameMap[i18n.language] ?? languageToMenuNameMap.fi
      }
      onTitleClick={() => {
        const rootPath = i18n.language === 'fi' ? '/' : `/${i18n.language}`;
        navigate(rootPath);
      }}
      getPathnameForLanguage={getPathnameForLanguage}
      getIsItemActive={getIsItemActive}
      userNavigation={<UserNavigation />}
    />
  );
}

export default Navigation;
