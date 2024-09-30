import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useMatomo } from '@jonkoops/matomo-tracker-react';

import { getCurrentLanguage } from '../../../../common/translation/TranslationUtils';

function useTitle(title?: string) {
  const { t } = useTranslation();

  if (!title) {
    return;
  }

  return title !== 'appName' ? `${t(title)} - ${t('appName')}` : t('appName');
}

type Props = {
  title?: string;
  description?: string;
};

const PageMeta = ({
  title,
  description = 'homePage.hero.descriptionText',
}: Props) => {
  const locales = ['fi', 'sv', 'en'];
  const { i18n, t } = useTranslation();
  const lang = getCurrentLanguage(i18n);
  const { trackPageView } = useMatomo();
  const translatedTitle = useTitle(title);

  const translatedDescription =
    title !== 'homePage.hero.descriptionText'
      ? t(description)
      : t('homePage.hero.descriptionText');

  const origin = window.location.origin.toString();
  const path = window.location.pathname.replace(new RegExp(`^/${lang}`), '');

  const canonical = `${origin}/${lang}${path}`;

  useEffect(() => {
    if (translatedTitle) {
      trackPageView({
        documentTitle: translatedTitle,
        href: window.location.href,
      });
    }
  }, [trackPageView, translatedTitle]);

  return (
    <Helmet>
      <html lang={lang} />
      {translatedTitle && <title>{translatedTitle}</title>}
      <meta name="description" content={translatedDescription} />
      <link rel="canonical" href={canonical} />
      {locales.map((l) => (
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
    </Helmet>
  );
};

export default PageMeta;
