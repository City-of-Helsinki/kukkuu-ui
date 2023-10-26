import type { ContentSource } from 'hds-react';
import { CookieModal, CookiePage, useCookies } from 'hds-react';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMatomo } from '@jonkoops/matomo-tracker-react';

import { getCurrentLanguage } from '../../common/translation/TranslationUtils';
import { MAIN_CONTENT_ID } from '../constants';

type Props = {
  appName: string;
  allowLanguageSwitch?: boolean;
  isModal?: boolean;
};

const CookieConsent: React.FC<Props> = ({
  appName,
  allowLanguageSwitch,
  isModal = true,
}) => {
  const { t, i18n } = useTranslation();
  const locale = getCurrentLanguage(i18n);
  const { getAllConsents } = useCookies();
  const { pushInstruction } = useMatomo();

  const [language, setLanguage] =
    React.useState<ContentSource['currentLanguage']>(locale);

  const [showCookieConsentModal, setShowCookieConsentModal] =
    React.useState(true);

  useEffect(() => {
    setLanguage(i18n.language as ContentSource['currentLanguage']);
  }, [i18n.language]);

  const handleMatomoUpdate = useCallback(() => {
    const getConsentStatus = (cookieId: string) => {
      const consents = getAllConsents();
      return consents[cookieId];
    };
    if (getConsentStatus('matomo')) {
      pushInstruction('requireCookieConsent');
    } else {
      pushInstruction('setCookieConsentGiven');
    }
  }, [getAllConsents, pushInstruction]);

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
        if (isModal) {
          setShowCookieConsentModal(false);
        }
        handleMatomoUpdate();
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
    [appName, t, language, onLanguageChange, isModal, handleMatomoUpdate]
  );

  if (!showCookieConsentModal) return null;

  return (
    <>
      {isModal && showCookieConsentModal && (
        <CookieModal contentSource={contentSource} />
      )}
      {!isModal && <CookiePage contentSource={contentSource} />}
    </>
  );
};

export default CookieConsent;
