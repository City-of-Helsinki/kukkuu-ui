import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useMatomo } from '@datapunt/matomo-tracker-react';

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
  const { i18n, t } = useTranslation();
  const lang = getCurrentLanguage(i18n);
  const { trackPageView } = useMatomo();
  const translatedTitle = useTitle(title);

  const translatedDescription =
    title !== 'homePage.hero.descriptionText'
      ? t(description)
      : t('homePage.hero.descriptionText');

  const path = window.location.pathname.replace(new RegExp(`^/${lang}/`), '');

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
      <link rel="alternate" hrefLang="fi" href={'/fi/' + path} />
      <link rel="alternate" hrefLang="sv" href={'/sv/' + path} />
      <link rel="alternate" hrefLang="en" href={'/en/' + path} />
    </Helmet>
  );
};

export default PageMeta;
