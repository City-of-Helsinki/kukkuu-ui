import { useCallback } from 'react';
import { Navigation as RHHCNavigation } from '@city-of-helsinki/react-helsinki-headless-cms/apollo';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import {
  Language,
  LanguageCodeEnum,
  MenuItem,
} from '@city-of-helsinki/react-helsinki-headless-cms';

import UserNavigation from './UserNavigation';
import { useCmsLanguageOptions } from '../../../hooks/useCmsLanguageOptions';
import { stripLocaleFromUri } from '../../../utils/cmsUtils';
import AppConfig from '../AppConfig';
import { getIsMenuItemActive } from './navigationUtils';

function Navigation() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const cmsLanguageOptions = useCmsLanguageOptions();

  const getHref = useCallback(
    (language: LanguageCodeEnum) => {
      const nav = cmsLanguageOptions?.find((cmsLanguageOption) => {
        return (
          cmsLanguageOption.locale?.toLowerCase() === language.toLowerCase()
        );
      });
      const strippedPathname = stripLocaleFromUri(location.pathname);
      const isCmsPage = cmsLanguageOptions.find(
        (option) => option.isCurrentPage && option.uri
      );
      if (!isCmsPage) {
        return `/${language.toLowerCase()}${strippedPathname}`;
      }

      return `/${language.toLowerCase()}${
        strippedPathname ? stripLocaleFromUri(nav?.uri ?? '') : ''
      }`;
    },
    [cmsLanguageOptions, location.pathname]
  );

  const getPathnameForLanguage = (language: Language): string => {
    const languageCode = language.code ?? LanguageCodeEnum.Fi;
    return getHref(languageCode);
  };

  const getIsItemActive = (menuItem: MenuItem): boolean =>
    getIsMenuItemActive(
      menuItem,
      location.pathname || globalThis.window.location.pathname
    );

  const headerMenuName =
    AppConfig.cmsHeaderMenuNames[
      i18n.language as keyof typeof AppConfig.cmsHeaderMenuNames
    ] ?? AppConfig.cmsHeaderMenuNames.fi;

  return (
    <RHHCNavigation
      menuName={headerMenuName}
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
