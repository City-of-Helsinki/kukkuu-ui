import { useCallback, useEffect } from 'react';
import {
  Navigation as RHHCNavigation,
  useMenuQuery,
} from '@city-of-helsinki/react-helsinki-headless-cms/apollo';
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
  getIsMenuItemActive,
  prefetchCmsMenuItems,
  scheduleIdle,
} from './navigationUtils';
import { NavPillSkeleton } from '../../../common/components/skeleton/CmsSkeleton';
import { useCmsLoadingState } from '../../../hooks/useCmsLoadingState';
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

  return (
    <div
      className={styles.navigationWrapper}
      aria-busy={isNavLoading ? 'true' : undefined}
    >
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
      {isNavLoading && (
        <div
          className={styles.navSkeletonBar}
          data-testid="nav-menu-skeleton"
          aria-hidden="true"
        >
          <div className={styles.navSkeletonRow}>
            <NavPillSkeleton width="6rem" />
            <NavPillSkeleton width="7.5rem" />
            <NavPillSkeleton width="6.5rem" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Navigation;
