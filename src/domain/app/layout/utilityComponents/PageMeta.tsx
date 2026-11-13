import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import type {
  ArticleType,
  PageType,
} from '@city-of-helsinki/react-helsinki-headless-cms';

import { getCurrentLanguage } from '../../../../common/translation/TranslationUtils';
import { unescapeDash } from '../../../../utils/cmsUtils';

/**
 * Formats the document title with the app name suffix unless it is the base app name.
 */
function useTitle(title?: string) {
  const { t } = useTranslation();

  if (!title) {
    return;
  }

  return title !== 'appName' ? `${t(title)} - ${t('appName')}` : t('appName');
}

export type PageMetaProps = {
  title?: string;
  description?: string;
  image?: string;
  page?: PageType | ArticleType | null;
  // children props makes this extendable by RHHC Config's Head
  children?: React.ReactNode;
};

/**
 * Renders HTML document head metadata, OpenGraph, Twitter, and canonical tags using react-helmet-async.
 *
 * Automatically tracks page views in Matomo and prioritizes CMS SEO metadata when available.
 */
const PageMeta = ({
  title,
  description = 'homePage.hero.descriptionText',
  image,
  page,
  children,
}: PageMetaProps) => {
  const locales = ['fi', 'sv', 'en'];
  const { i18n, t } = useTranslation();
  const lang = getCurrentLanguage(i18n);
  const { trackPageView } = useMatomo();
  const translatedTitle = useTitle(title);

  const translatedDescription =
    description !== 'homePage.hero.descriptionText'
      ? t(description)
      : t('homePage.hero.descriptionText');

  const seo = page?.seo;
  const resolvedTitle = unescapeDash(seo?.title) || translatedTitle;
  const resolvedDescription =
    unescapeDash(seo?.description) || translatedDescription;
  const openGraphTitle =
    unescapeDash(seo?.openGraphTitle) || resolvedTitle;
  const openGraphDescription =
    unescapeDash(seo?.openGraphDescription) || resolvedDescription;
  const openGraphType = seo?.openGraphType;
  const socialImage =
    seo?.socialImage?.mediaItemUrl ||
    page?.featuredImage?.node?.mediaItemUrl ||
    image;
  const twitterTitle = unescapeDash(seo?.twitterTitle) || resolvedTitle;
  const twitterDescription =
    unescapeDash(seo?.twitterDescription) || resolvedDescription;

  const origin = globalThis.window.location.origin.toString();
  const path = globalThis.window.location.pathname.replace(
    new RegExp(`^/${lang}/`),
    '/'
  );

  const canonical = `${origin}/${lang}${path}`;

  useEffect(() => {
    if (resolvedTitle) {
      trackPageView({
        documentTitle: resolvedTitle,
        href: globalThis.window.location.href,
      });
    }
  }, [trackPageView, resolvedTitle]);

  return (
    <Helmet>
      <html lang={lang} />
      {resolvedTitle && <title>{resolvedTitle}</title>}
      <meta name="description" content={resolvedDescription} />
      {openGraphTitle && <meta property="og:title" content={openGraphTitle} />}
      {openGraphDescription && (
        <meta property="og:description" content={openGraphDescription} />
      )}
      {openGraphType && <meta property="og:type" content={openGraphType} />}
      {socialImage && <meta property="og:image" content={socialImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      {twitterTitle && <meta name="twitter:title" content={twitterTitle} />}
      {twitterDescription && (
        <meta name="twitter:description" content={twitterDescription} />
      )}
      {socialImage && <meta name="twitter:image" content={socialImage} />}
      <link rel="canonical" href={canonical} />
      {page?.translations && page.translations.length > 0
        ? [
            <link
              key={lang}
              rel="alternate"
              hrefLang={lang}
              href={canonical}
            />,
            ...page.translations.map((translation) => {
              const translationLang = (
                translation?.language?.code ||
                translation?.language?.slug ||
                'fi'
              ).toLowerCase();
              const translationUri = translation?.uri
                ? `${origin}${translation.uri.replace(/\/$/, '')}`
                : `${origin}/${translationLang}${path}`;
              return (
                <link
                  key={translationLang}
                  rel="alternate"
                  hrefLang={translationLang}
                  href={translationUri}
                />
              );
            }),
          ]
        : locales.map((l) => (
            <link
              key={l}
              rel="alternate"
              hrefLang={l}
              href={`${origin}/${l}${path}`}
            />
          ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${origin}/${locales[0]}${path ? path : ''}`}
      />
      <meta property="og:locale" content={lang} />
      <meta property="og:url" content={canonical} />
      <meta property="twitter:url" content={canonical} />
      {children}
    </Helmet>
  );
};

export default PageMeta;
