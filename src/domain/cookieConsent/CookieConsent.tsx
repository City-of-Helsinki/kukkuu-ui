import { CookieConsentContextProvider, CookieBanner } from 'hds-react';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMatomo } from '@jonkoops/matomo-tracker-react';

import { getCurrentLanguage } from '../../common/translation/TranslationUtils';
import { MAIN_CONTENT_ID } from '../constants';

type Props = {
  appName: string;
  allowLanguageSwitch?: boolean;
};

const CookieConsent: React.FC<Props> = ({ appName, allowLanguageSwitch }) => {
  const { t, i18n } = useTranslation();
  const locale = getCurrentLanguage(i18n);
  const { pushInstruction } = useMatomo();
  const tFi = React.useMemo(() => i18n.getFixedT('fi'), [i18n]);
  const tSv = React.useMemo(() => i18n.getFixedT('sv'), [i18n]);
  const tEn = React.useMemo(() => i18n.getFixedT('en'), [i18n]);

  const [language, setLanguage] = React.useState<'en' | 'fi' | 'sv'>(
    locale as 'en' | 'fi' | 'sv'
  );

  useEffect(() => {
    setLanguage(getCurrentLanguage(i18n) as 'en' | 'fi' | 'sv');
  }, [i18n.language, i18n]);

  const handleMatomoUpdate = useCallback(
    (changeEvent: { type: string; acceptedGroups: string[] }) => {
      if (changeEvent.acceptedGroups.includes('matomo')) {
        pushInstruction('setCookieConsentGiven');
      } else {
        pushInstruction('requireCookieConsent');
      }
    },
    [pushInstruction]
  );

  const onLanguageChange = React.useCallback(
    (newLang: string) => {
      if (allowLanguageSwitch) {
        setLanguage(newLang as 'en' | 'fi' | 'sv');
        i18n.changeLanguage(newLang);
      }
    },
    [i18n, allowLanguageSwitch]
  );

  const siteSettings = React.useMemo(
    () => {
      const localized = (key: string, options?: Record<string, unknown>) => ({
        fi: tFi(key, options),
        sv: tSv(key, options),
        en: tEn(key, options),
      });

      return {
        siteName: appName,
        currentLanguage: language,
        language: {
          onLanguageChange: allowLanguageSwitch ? onLanguageChange : undefined,
        },
        languages: [
          { code: 'fi', name: 'Suomi', direction: 'ltr' },
          { code: 'sv', name: 'Svenska', direction: 'ltr' },
          { code: 'en', name: 'English', direction: 'ltr' },
        ],
        focusTargetSelector: `#${MAIN_CONTENT_ID}`,
        translations: {
          heading: {
            fi: t('consent.texts.ui.heading', { appName }),
            sv: t('consent.texts.ui.heading', { appName }),
            en: t('consent.texts.ui.heading', { appName }),
          },
          description: {
            fi: t('consent.texts.sections.main.text'),
            sv: t('consent.texts.sections.main.text'),
            en: t('consent.texts.sections.main.text'),
          },
          approveAllConsents: {
            fi: t('consent.texts.ui.approveAllConsents'),
            sv: t('consent.texts.ui.approveAllConsents'),
            en: t('consent.texts.ui.approveAllConsents'),
          },
          approveOnlyRequiredConsents: {
            fi: t('consent.texts.ui.approveOnlyRequiredConsents'),
            sv: t('consent.texts.ui.approveOnlyRequiredConsents'),
            en: t('consent.texts.ui.approveOnlyRequiredConsents'),
          },
          approveRequiredAndSelectedConsents: {
            fi: t('consent.texts.ui.approveRequiredAndSelectedConsents'),
            sv: t('consent.texts.ui.approveRequiredAndSelectedConsents'),
            en: t('consent.texts.ui.approveRequiredAndSelectedConsents'),
          },
          bannerAriaLabel: {
            fi: t('cookieConsent.title'),
            sv: t('cookieConsent.title'),
            en: t('cookieConsent.title'),
          },
          showDetails: {
            fi: t('consent.texts.ui.showDetails'),
            sv: t('consent.texts.ui.showDetails'),
            en: t('consent.texts.ui.showDetails'),
          },
          hideDetails: {
            fi: t('consent.texts.ui.hideDetails'),
            sv: t('consent.texts.ui.hideDetails'),
            en: t('consent.texts.ui.hideDetails'),
          },
          formHeading: {
            fi: t('consent.texts.ui.formHeading'),
            sv: t('consent.texts.ui.formHeading'),
            en: t('consent.texts.ui.formHeading'),
          },
          formText: {
            fi: t('consent.texts.sections.main.text'),
            sv: t('consent.texts.sections.main.text'),
            en: t('consent.texts.sections.main.text'),
          },
          showCookieSettings: {
            fi: t('consent.texts.ui.showCookieSettings'),
            sv: t('consent.texts.ui.showCookieSettings'),
            en: t('consent.texts.ui.showCookieSettings'),
          },
          hideCookieSettings: {
            fi: t('consent.texts.ui.hideSettings'),
            sv: t('consent.texts.ui.hideSettings'),
            en: t('consent.texts.ui.hideSettings'),
          },
          acceptedAt: {
            fi: t('consent.texts.ui.acceptedAt'),
            sv: t('consent.texts.ui.acceptedAt'),
            en: t('consent.texts.ui.acceptedAt'),
          },
          highlightedGroup: {
            fi: t('consent.texts.ui.highlightedGroup'),
            sv: t('consent.texts.ui.highlightedGroup'),
            en: t('consent.texts.ui.highlightedGroup'),
          },
          highlightedGroupAria: {
            fi: t('consent.texts.ui.highlightedGroupAria'),
            sv: t('consent.texts.ui.highlightedGroupAria'),
            en: t('consent.texts.ui.highlightedGroupAria'),
          },
          tableHeadingsName: {
            fi: t('consent.texts.ui.tableHeadingsName'),
            sv: t('consent.texts.ui.tableHeadingsName'),
            en: t('consent.texts.ui.tableHeadingsName'),
          },
          tableHeadingsHostName: {
            fi: t('consent.texts.ui.tableHeadingsHostName'),
            sv: t('consent.texts.ui.tableHeadingsHostName'),
            en: t('consent.texts.ui.tableHeadingsHostName'),
          },
          tableHeadingsDescription: {
            fi: t('consent.texts.ui.tableHeadingsDescription'),
            sv: t('consent.texts.ui.tableHeadingsDescription'),
            en: t('consent.texts.ui.tableHeadingsDescription'),
          },
          tableHeadingsExpiration: {
            fi: t('consent.texts.ui.tableHeadingsExpiration'),
            sv: t('consent.texts.ui.tableHeadingsExpiration'),
            en: t('consent.texts.ui.tableHeadingsExpiration'),
          },
          tableHeadingsType: {
            fi: t('consent.texts.ui.tableHeadingsType'),
            sv: t('consent.texts.ui.tableHeadingsType'),
            en: t('consent.texts.ui.tableHeadingsType'),
          },
          storageType1: {
            fi: t('consent.texts.ui.storageType1'),
            sv: t('consent.texts.ui.storageType1'),
            en: t('consent.texts.ui.storageType1'),
          },
          storageType2: {
            fi: t('consent.texts.ui.storageType2'),
            sv: t('consent.texts.ui.storageType2'),
            en: t('consent.texts.ui.storageType2'),
          },
        },
        requiredGroups: [
          {
            groupId: 'essential-custom',
            title: localized('consent.groups.essential.title'),
            description: localized('consent.groups.essential.text'),
            cookies: [
              {
                name: 'city-of-helsinki-cookie-consents',
                host: window.location.hostname,
                storageType: 1,
                description: localized('consent.cookies.i18next'),
                expiration: localized('consent.expiration.year'),
              },
              {
                name: 'wordpress_*, wp-settings-*',
                host: 'api.hel.fi',
                storageType: 1,
                description: localized('consent.cookies.wordpress'),
                expiration: localized('consent.expiration.session'),
              },
              {
                name: 'linkedevents-api-prod-csrftoken',
                host: 'api.hel.fi',
                storageType: 1,
                description: localized('consent.cookies.linkedevents'),
                expiration: localized('consent.expiration.year'),
              },
              {
                name: 'i18next',
                host: 'api.hel.fi',
                storageType: 1,
                description: localized('consent.cookies.i18next'),
                expiration: localized('consent.expiration.session'),
              },
            ],
          },
        ],
        optionalGroups: [
          {
            groupId: 'matomo',
            title: localized('consent.groups.matomo.title'),
            description: localized('consent.groups.matomo.text'),
            expandAriaLabel: localized('consent.groups.matomo.expandAriaLabel'),
            checkboxAriaDescription: localized(
              'consent.groups.matomo.checkboxAriaDescription'
            ),
            cookies: [
              {
                name: '_pk*',
                host: 'digia.fi',
                storageType: 1,
                description: localized('consent.cookies.matomo'),
                expiration: localized('consent.expiration.days', { days: 393 }),
              },
            ],
          },
        ],
      };
    },
    [
      t,
      tFi,
      tSv,
      tEn,
      appName,
      language,
      allowLanguageSwitch,
      onLanguageChange,
    ]
  );

  return (
    <CookieConsentContextProvider
      siteSettings={siteSettings}
      options={{
        cookieDomain: window.location.hostname,
      }}
      onChange={handleMatomoUpdate}
    >
      <CookieBanner />
    </CookieConsentContextProvider>
  );
};

export default CookieConsent;
