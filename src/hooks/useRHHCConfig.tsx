import React, { useMemo } from 'react';
import {
  Config,
  defaultConfig,
  LanguageCodeEnum,
  ModuleItemTypeEnum,
  Link as RHHCLink,
} from 'react-helsinki-headless-cms';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import headlessCmsClient from '../domain/headlessCms/client';
import AppConfig from '../domain/app/AppConfig';
import { SUPPORT_LANGUAGES } from '../common/translation/TranslationConstants';

const APP_DOMAIN = new URL(AppConfig.origin).origin;
const API_URI = new URL(AppConfig.apiUrl).origin;
const CMS_URI = new URL(AppConfig.cmsUri).origin;

const ReactRouterLinkWrapper = ({
  href,
  ...delegatedProps
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <Link {...delegatedProps} to={href as string} />
);

const ReactRouterStyledLinkWrapper = ({
  href,
  target,
  ...delegatedProps
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const internalLink = !href?.startsWith('http');

  if (internalLink) {
    return (
      <Link {...delegatedProps} to={href as string}>
        <RHHCLink />
      </Link>
    );
  }

  return (
    <RHHCLink
      {...delegatedProps}
      openInNewTab={target === '_blank'}
      href={href}
    />
  );
};

const appLanguageToRHHCLanguageMap = {
  [SUPPORT_LANGUAGES.FI]: LanguageCodeEnum.Fi,
  [SUPPORT_LANGUAGES.SV]: LanguageCodeEnum.Sv,
  [SUPPORT_LANGUAGES.EN]: LanguageCodeEnum.En,
};

export default function useRHHCConfig(): Config {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const internalHrefOrigins = useMemo(() => [APP_DOMAIN, API_URI, CMS_URI], []);
  return useMemo(
    () => ({
      ...defaultConfig,
      siteName: t('appName'),
      internalHrefOrigins,
      apolloClient: headlessCmsClient,
      currentLanguageCode:
        appLanguageToRHHCLanguageMap[language] ?? LanguageCodeEnum.Fi,
      components: {
        Img: defaultConfig.components.Img,
        A: ReactRouterLinkWrapper,
        Link: ReactRouterStyledLinkWrapper,
      },
      copy: {
        breadcrumbNavigationLabel: '', // t('common.breadcrumbNavigationLabel'),
        breadcrumbListLabel: t('common.breadcrumbListLabel'),
        menuToggleAriaLabel: t('common.menuToggleAriaLabel'),
        skipToContentLabel: t('common.skipToContentLabel'),
        openInExternalDomainAriaLabel: t(
          'common.openInExternalDomainAriaLabel'
        ),
        openInNewTabAriaLabel: t('common.openInNewTabAriaLabel'),
        closeButtonLabelText: t('common.closeButtonLabelText'),
        loadMoreButtonLabelText: t('common.loadMoreButtonLabelText'),
        showAllText: t('common.showAllText'),
        archiveSearch: {
          title: '', // t('cms:archiveSearch.title'),
          searchTextPlaceholder: t('cms:archiveSearch.searchTextPlaceholder'),
          searchButtonLabelText: t('cms:archiveSearch.searchButtonLabelText'),
          loadMoreButtonLabelText: t(
            'cms:archiveSearch.loadMoreButtonLabelText'
          ),
          noResultsText: t('cms:archiveSearch.noResultsText'),
          noResultsTitle: t('cms:archiveSearch.noResultsTitle'),
          clearAll: t('cms:archiveSearch.buttonClearFilters'),
        },
        next: t('common:button.next'),
        previous: t('common:button.previous'),
      },
      utils: {
        ...defaultConfig.utils,
        getRoutedInternalHref: (
          link?: string | null,
          type?: ModuleItemTypeEnum
        ) => {
          if (!link) {
            return '#';
          }
          internalHrefOrigins.forEach((origin) => {
            if (link.includes(origin)) {
              return link.replace(origin, '');
            }
          });
          return link;
        },
        getShowAllUrl: () => '',
      },
      htmlSanitizer: {
        allowedUnsafeTags: ['iframe'],
        trustedOrigins: ['https://www.youtube.com', 'https://player.vimeo.com'],
      },
      fallbackImageUrls: [''], // A hacky way to hide the Hero image from HeadlessCmsPage
    }),
    [t, internalHrefOrigins, language]
  );
}
