import type { ContentSource } from 'hds-react';
import { CookieModal } from 'hds-react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { getCurrentLanguage } from '../../common/translation/TranslationUtils';
import { MAIN_CONTENT_ID } from '../constants';

type Props = {
  appName: string;
  allowLanguageSwitch?: boolean;
};

const CookieConsent: React.FC<Props> = ({ appName, allowLanguageSwitch }) => {
  const { t, i18n } = useTranslation();
  const locale = getCurrentLanguage(i18n);

  const [language, setLanguage] =
    React.useState<ContentSource['currentLanguage']>(locale);

  const [showCookieConsentModal, setShowCookieConsentModal] =
    React.useState(true);

  useEffect(() => {
    setLanguage(i18n.language as ContentSource['currentLanguage']);
  }, [i18n.language]);

  const onLanguageChange = React.useCallback(
    (newLang: string) => {
      if (allowLanguageSwitch) {
        setLanguage(newLang as ContentSource['currentLanguage']);
        i18n.changeLanguage(newLang);
      }
    },
    [i18n, setLanguage, allowLanguageSwitch]
  );

  const contentSource: ContentSource = React.useMemo(
    () => ({
      siteName: appName,
      texts: {
        sections: {
          main: {
            text: t('consent.texts.sections.main.text'),
          },
        },
        ui: {
          approveOnlyRequiredConsents: t(
            'consent.texts.ui.approveOnlyRequiredConsents'
          ),
          hideSettings: t('consent.texts.ui.hideSettings'),
        },
      },
      onAllConsentsGiven: () => {
        setShowCookieConsentModal(false);
      },
      currentLanguage: language as string as ContentSource['currentLanguage'],
      requiredCookies: {
        title: t('consent.required.title'),
        text: t('consent.required.text'),
        groups: [
          {
            id: 'essential-custom',
            title: t('consent.groups.essential.title'),
            text: t('consent.groups.essential.text'),
            cookies: [
              {
                id: 'wordpress',
                name: 'wordpress_*, wp-settings-*',
                hostName: 'api.hel.fi',
                description: t('consent.cookies.wordpress'),
                expiration: t('consent.expiration.session'),
              },
              {
                id: 'linkedevents',
                name: 'linkedevents-api-prod-csrftoken',
                hostName: 'api.hel.fi',
                description: t('consent.cookies.linkedevents'),
                expiration: t('consent.expiration.year'),
              },
              {
                id: 'i18next',
                name: 'i18next',
                hostName: 'api.hel.fi',
                description: t('consent.cookies.i18next'),
                expiration: t('consent.expiration.session'),
              },
            ],
          },
        ],
      },
      optionalCookies: {
        title: t('consent.optional.title'),
        groups: [
          {
            title: t('consent.groups.matomo.title'),
            text: t('consent.groups.matomo.text'),
            expandAriaLabel: t('consent.groups.matomo.expandAriaLabel'),
            checkboxAriaDescription: t(
              'consent.groups.matomo.checkboxAriaDescription'
            ),
            cookies: [
              {
                id: 'matomo',
                name: '_pk*',
                hostName: 'digia.fi',
                description: t('consent.cookies.matomo'),
                expiration: t('consent.expiration.days', { days: 393 }),
              },
            ],
          },
        ],
      },
      language: {
        current: language,
        onLanguageChange,
      },
      focusTargetSelector: MAIN_CONTENT_ID,
    }),
    [t, language, appName, onLanguageChange]
  );

  if (!showCookieConsentModal) return null;

  return <CookieModal contentSource={contentSource} />;
};

export default CookieConsent;
