import { CookieConsentContextProvider, CookieBanner } from 'hds-react';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMatomo } from '@jonkoops/matomo-tracker-react';

import { getCurrentLanguage } from '../../common/translation/TranslationUtils';
import { MAIN_CONTENT_ID } from '../constants';

const COOKIE_CONSENT_STORAGE_TYPE = {
  cookie: 1,
  localStorage: 2,
  sessionStorage: 3,
  indexedDB: 4,
  cacheStorage: 5,
};

type Props = {
  appName: string;
  allowLanguageSwitch?: boolean;
};

const CookieConsent: React.FC<Props> = ({ appName, allowLanguageSwitch }) => {
  const { i18n } = useTranslation();
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
          heading: localized('consent.texts.ui.heading', { appName }),
          description: localized('consent.texts.sections.main.text'),
          approveAllConsents: localized('consent.texts.ui.approveAllConsents'),
          approveOnlyRequiredConsents: localized(
            'consent.texts.ui.approveOnlyRequiredConsents'
          ),
          approveRequiredAndSelectedConsents: localized(
            'consent.texts.ui.approveRequiredAndSelectedConsents'
          ),
          bannerAriaLabel: localized('cookieConsent.title'),
          showDetails: localized('consent.texts.ui.showDetails'),
          hideDetails: localized('consent.texts.ui.hideDetails'),
          formHeading: localized('consent.texts.ui.formHeading'),
          formText: localized('consent.texts.sections.main.text'),
          showCookieSettings: localized(
            'consent.texts.ui.showCookieSettings'
          ),
          hideCookieSettings: localized('consent.texts.ui.hideSettings'),
          acceptedAt: localized('consent.texts.ui.acceptedAt'),
          highlightedGroup: localized('consent.texts.ui.highlightedGroup'),
          highlightedGroupAria: localized(
            'consent.texts.ui.highlightedGroupAria'
          ),
          tableHeadingsName: localized('consent.texts.ui.tableHeadingsName'),
          tableHeadingsHostName: localized(
            'consent.texts.ui.tableHeadingsHostName'
          ),
          tableHeadingsDescription: localized(
            'consent.texts.ui.tableHeadingsDescription'
          ),
          tableHeadingsExpiration: localized(
            'consent.texts.ui.tableHeadingsExpiration'
          ),
          tableHeadingsType: localized('consent.texts.ui.tableHeadingsType'),
          storageType1: localized('consent.texts.ui.storageType1'),
          storageType2: localized('consent.texts.ui.storageType2'),
          storageType3: localized('consent.texts.ui.storageType3'),
        },
        requiredGroups: [
          {
            groupId: 'essential-custom',
            title: localized('consent.groups.essential.title'),
            description: localized('consent.groups.essential.text'),
            cookies: [
              {
                name: 'city-of-helsinki-cookie-consents',
                host: globalThis.location.hostname,
                storageType: COOKIE_CONSENT_STORAGE_TYPE.cookie,
                description: localized('consent.cookies.i18next'),
                expiration: localized('consent.expiration.year'),
              },
              {
                name: 'wordpress_*, wp-settings-*',
                host: 'api.hel.fi',
                storageType: COOKIE_CONSENT_STORAGE_TYPE.cookie,
                description: localized('consent.cookies.wordpress'),
                expiration: localized('consent.expiration.session'),
              },
              {
                name: 'linkedevents-api-prod-csrftoken',
                host: 'api.hel.fi',
                storageType: COOKIE_CONSENT_STORAGE_TYPE.cookie,
                description: localized('consent.cookies.linkedevents'),
                expiration: localized('consent.expiration.year'),
              },
              {
                name: 'i18next',
                host: 'api.hel.fi',
                storageType: COOKIE_CONSENT_STORAGE_TYPE.cookie,
                description: localized('consent.cookies.i18next'),
                expiration: localized('consent.expiration.session'),
              },
              { 
                name: 'AUTH_SESSION_ID',
                host: 'tunnistus.hel.fi',
                storageType: COOKIE_CONSENT_STORAGE_TYPE.cookie,
                description: localized('consent.cookies.authSessionId'),
                expiration: localized('consent.expiration.session'),
              },
              {
                name: 'KC_*',
                host: 'tunnistus.hel.fi',
                storageType: COOKIE_CONSENT_STORAGE_TYPE.cookie,
                description: localized('consent.cookies.keycloak_generic'),
                expiration: localized('consent.expiration.session'),
              },
              
              {
                name: 'oidc.user:*',
                host: globalThis.location.hostname,
                storageType: COOKIE_CONSENT_STORAGE_TYPE.sessionStorage,
                description: localized('consent.cookies.oidc'),
                expiration: localized('consent.expiration.session'),
              },
              {
                name: 'hds_login_api_token_storage_key',
                host: globalThis.location.hostname,
                storageType: COOKIE_CONSENT_STORAGE_TYPE.sessionStorage,
                description: localized('consent.cookies.hdsTokenStorage'),
                expiration: localized('consent.expiration.session'),
              },
              {
                name: 'hds_login_api_token_user_reference',
                host: globalThis.location.hostname,
                storageType: COOKIE_CONSENT_STORAGE_TYPE.sessionStorage,
                description: localized('consent.cookies.hdsUserReference'),
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
                storageType: COOKIE_CONSENT_STORAGE_TYPE.cookie,
                description: localized('consent.cookies.matomo'),
                expiration: localized('consent.expiration.days', { days: 393 }),
              },
              {
                name: "mtm_.*",
                host: globalThis.location.hostname,
                storageType: COOKIE_CONSENT_STORAGE_TYPE.cookie,
                description: localized('consent.cookies.mtm'),
                expiration: localized('consent.expiration.days', { days: 400 }),
              },
            ],
          },
        ],
      };
    },
    [
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
        language
      }}
      onChange={handleMatomoUpdate}
    >
      <CookieBanner />
    </CookieConsentContextProvider>
  );
};

export default CookieConsent;
