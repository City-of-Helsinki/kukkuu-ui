import { useCallback, useEffect } from 'react';
import { useMenuQuery } from '@city-of-helsinki/react-helsinki-headless-cms/apollo';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import {
  Language,
  LanguageCodeEnum,
  MenuItem,
} from '@city-of-helsinki/react-helsinki-headless-cms';

import headlessCmsClient from '../../headlessCms/client';
import UserNavigation from './UserNavigation';
import { useCmsLanguageOptions } from '../../../hooks/useCmsLanguageOptions';
import { stripLocaleFromUri } from '../../../utils/cmsUtils';
import AppConfig from '../AppConfig';
import {
  closeMobileMenu,
  closeUserDropdown,
  getIsMenuItemActive,
  prefetchCmsMenuItems,
  scheduleIdle,
} from './navigationUtils';
import { useCmsLoadingState } from '../../../hooks/useCmsLoadingState';
import { HeaderNavigation } from './HeaderNavigation';
import { DEFAULT_LANGUAGE } from '../../../common/translation/TranslationConstants';
import { HARDCODED_CMS_LANGUAGES } from '../../languages/constants';
import styles from './navigation.module.scss';

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

  const menuQueryResult = useMenuQuery({
    variables: {
      id: headerMenuName,
      menuIdentifiersOnly: false,
    },
  });
  const { isInitialLoading: isNavLoading } = useCmsLoadingState(menuQueryResult);

  const menuItems = menuQueryResult.data?.menu?.menuItems?.nodes;
  useEffect(() => {
    if (!menuItems || menuItems.length === 0) {
      return;
    }

    const cancelIdle = scheduleIdle(() => {
      prefetchCmsMenuItems(menuItems, i18n.language, headlessCmsClient);
    });

    return cancelIdle;
  }, [menuItems, i18n.language]);

  useEffect(() => {
    closeUserDropdown();
  }, [location.pathname]);

  const handleTitleClick = (event?: React.MouseEvent) => {
    event?.preventDefault();
    closeMobileMenu();
    closeUserDropdown();
    const rootPath =
      i18n.language === DEFAULT_LANGUAGE.toString() ? '/' : `/${i18n.language}`;
    navigate(rootPath);
  };

  return (
    <div
      className={styles.navigationWrapper}
      aria-busy={isNavLoading ? 'true' : undefined}
    >
      <HeaderNavigation
        menu={menuQueryResult.data?.menu}
        languages={[...HARDCODED_CMS_LANGUAGES]}
        getPathnameForLanguage={getPathnameForLanguage}
        getIsItemActive={getIsItemActive}
        onTitleClick={handleTitleClick}
        isLoading={isNavLoading}
        userNavigation={
          <UserNavigation
            fixedRightPosition
          />
        }
      />
    </div>
  );
}

export default Navigation;
