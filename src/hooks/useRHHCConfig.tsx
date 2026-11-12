import { useMemo } from 'react';
import {
  Config,
  defaultConfig as rhhcDefaultConfig,
  LanguageCodeEnum,
} from '@city-of-helsinki/react-helsinki-headless-cms';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import headlessCmsClient from '../domain/headlessCms/client';
import { SUPPORT_LANGUAGES } from '../common/translation/TranslationConstants';
import PageMeta from '../domain/app/layout/utilityComponents/PageMeta';
import ArticleDetails, {
  ArticleDetailsProps,
} from '../domain/article/articleDetails/ArticleDetails';
import {
  getInternalHrefOrigins,
  getRoutedInternalHref,
} from '../utils/cmsUtils';

const appLanguageToRHHCLanguageMap = {
  [SUPPORT_LANGUAGES.FI]: LanguageCodeEnum.Fi,
  [SUPPORT_LANGUAGES.SV]: LanguageCodeEnum.Sv,
  [SUPPORT_LANGUAGES.EN]: LanguageCodeEnum.En,
};

/**
 * Provides the configuration object for `react-helsinki-headless-cms` (RHHC) ConfigProvider.
 *
 * Configures the Apollo Client, language mapping, internal href origins,
 * link router components (react-router `Link`), custom article details, and page SEO metadata.
 *
 * @returns Configured RHHC Config object.
 */
export default function useRHHCConfig(): Config {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const internalHrefOrigins = useMemo(() => getInternalHrefOrigins(), []);
  return useMemo(
    () => ({
      ...rhhcDefaultConfig,
      siteName: t('appName'),
      internalHrefOrigins,
      apolloClient: headlessCmsClient,
      currentLanguageCode:
        appLanguageToRHHCLanguageMap[language] ?? LanguageCodeEnum.Fi,
      components: {
        ...rhhcDefaultConfig.components,
        A: ({ href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
          <Link to={href ?? ''} {...props} />
        ),
        Link: ({
          href,
          ...props
        }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
          <Link to={href ?? ''} {...props} />
        ),
        ArticleCardContent: (props: ArticleDetailsProps) => (
          <ArticleDetails {...props} />
        ),
        Img: rhhcDefaultConfig.components.Img,
        // Extend the Kukkuu PageMeta with the RHHC PageMeta
        // to get the CMS Page SEO Meta to work properly.
        Head: ({ children }) => <PageMeta>{children}</PageMeta>,
      },
      copy: {
        breadcrumbNavigationLabel: '', // t('common.breadcrumbNavigationLabel'),
        breadcrumbListLabel: t('common.breadcrumbListLabel'),
        menuButtonLabel: t('common.menuButtonLabel'),
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
          title: t('cms.archiveSearch.title', 'Ajankohtaista'),
          searchTextPlaceholder: t('cms.archiveSearch.searchTextPlaceholder'),
          searchButtonLabelText: t('cms.archiveSearch.searchButtonLabelText'),
          loadMoreButtonLabelText: t(
            'cms.archiveSearch.loadMoreButtonLabelText'
          ),
          noResultsText: t('cms.archiveSearch.noResultsText'),
          noResultsTitle: t('cms.archiveSearch.noResultsTitle'),
          clearAll: t('cms.archiveSearch.buttonClearFilters'),
        },
        next: t('common:button.next'),
        previous: t('common:button.previous'),
      },
      utils: {
        ...rhhcDefaultConfig.utils,
        getRoutedInternalHref: (link, type) =>
          getRoutedInternalHref(link, type, language),
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
