import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useMatomo } from '@datapunt/matomo-tracker-react';

import useAriaLive from '../../../../common/AriaLive/useAriaLive';
import { getCurrentLanguage } from '../../../../common/translation/TranslationUtils';

type Props = {
  title?: string;
  description?: string;
};

const PageMeta = ({
  title = 'appName',
  description = 'homePage.hero.descriptionText',
}: Props) => {
  const { i18n, t } = useTranslation();
  const { sendMessage } = useAriaLive();
  const lang = getCurrentLanguage(i18n);

  const translatedTitle =
    title !== 'appName' ? `${t(title)} - ${t('appName')}` : t('appName');
  const translatedDescription =
    title !== 'homePage.hero.descriptionText'
      ? t(description)
      : t('homePage.hero.descriptionText');

  const path = window.location.pathname.replace(`/${lang}/`, '');

  const { trackPageView } = useMatomo();
  useEffect(() => {
    trackPageView({
      documentTitle: translatedTitle,
      href: window.location.href,
    });
  }, [trackPageView, translatedTitle]);

  useEffect(() => {
    sendMessage(translatedTitle);
  }, [sendMessage, translatedTitle]);

  return (
    <Helmet>
      <html lang={lang} />
      <title>{translatedTitle}</title>
      <meta name="description" content={translatedDescription} />
      <link rel="alternate" hrefLang="fi" href={'/fi/' + path} />
      <link rel="alternate" hrefLang="sv" href={'/sv/' + path} />
      <link rel="alternate" hrefLang="en" href={'/en/' + path} />
    </Helmet>
  );
};

export default PageMeta;
