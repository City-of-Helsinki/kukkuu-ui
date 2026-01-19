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

  const [language, setLanguage] = React.useState<'en' | 'fi' | 'sv'>(
    locale as 'en' | 'fi' | 'sv'
  );

  useEffect(() => {
    setLanguage(i18n.language as 'en' | 'fi' | 'sv');
  }, [i18n.language]);

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
    () => ({
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
      focusTargetSelector: MAIN_CONTENT_ID,
      translations: {
        heading: {
          fi: `${appName} käyttää evästeitä`,
          sv: `${appName} använder kakor`,
          en: `${appName} uses cookies`,
        },
        description: {
          fi: t('consent.texts.sections.main.text'),
          sv: t('consent.texts.sections.main.text'),
          en: t('consent.texts.sections.main.text'),
        },
        approveAllConsents: {
          fi: 'Hyväksy kaikki evästeet',
          sv: 'Godkänn alla kakor',
          en: 'Accept all cookies',
        },
        approveOnlyRequiredConsents: {
          fi: t('consent.texts.ui.approveOnlyRequiredConsents'),
          sv: t('consent.texts.ui.approveOnlyRequiredConsents'),
          en: t('consent.texts.ui.approveOnlyRequiredConsents'),
        },
        approveRequiredAndSelectedConsents: {
          fi: 'Hyväksy valitut evästeet',
          sv: 'Godkänn valda kakor',
          en: 'Accept selected cookies',
        },
        bannerAriaLabel: {
          fi: t('cookieConsent.title'),
          sv: t('cookieConsent.title'),
          en: t('cookieConsent.title'),
        },
        showDetails: {
          fi: 'Näytä tiedot',
          sv: 'Visa detaljer',
          en: 'Show details',
        },
        hideDetails: {
          fi: 'Piilota tiedot',
          sv: 'Dölj detaljer',
          en: 'Hide details',
        },
        formHeading: {
          fi: 'Evästeasetukset',
          sv: 'Kakinställningar',
          en: 'Cookie settings',
        },
        formText: {
          fi: t('consent.texts.sections.main.text'),
          sv: t('consent.texts.sections.main.text'),
          en: t('consent.texts.sections.main.text'),
        },
        showCookieSettings: {
          fi: 'Näytä evästeasetukset',
          sv: 'Visa kakinställningar',
          en: 'Show cookie settings',
        },
        hideCookieSettings: {
          fi: t('consent.texts.ui.hideSettings'),
          sv: t('consent.texts.ui.hideSettings'),
          en: t('consent.texts.ui.hideSettings'),
        },
        tableHeadingsName: {
          fi: 'Nimi',
          sv: 'Namn',
          en: 'Name',
        },
        tableHeadingsHostName: {
          fi: 'Palvelin',
          sv: 'Server',
          en: 'Host',
        },
        tableHeadingsDescription: {
          fi: 'Kuvaus',
          sv: 'Beskrivning',
          en: 'Description',
        },
        tableHeadingsExpiration: {
          fi: 'Vanheneminen',
          sv: 'Utgångsdatum',
          en: 'Expiration',
        },
        tableHeadingsType: {
          fi: 'Tyyppi',
          sv: 'Typ',
          en: 'Type',
        },
        storageType1: {
          fi: 'Eväste',
          sv: 'Kaka',
          en: 'Cookie',
        },
        storageType2: {
          fi: 'Paikallinen tallennus',
          sv: 'Lokal lagring',
          en: 'Local storage',
        },
      },
      requiredGroups: [
        {
          groupId: 'essential-custom',
          title: {
            fi: t('consent.groups.essential.title'),
            sv: t('consent.groups.essential.title'),
            en: t('consent.groups.essential.title'),
          },
          description: {
            fi: t('consent.groups.essential.text'),
            sv: t('consent.groups.essential.text'),
            en: t('consent.groups.essential.text'),
          },
          cookies: [
            {
              name: 'city-of-helsinki-cookie-consents',
              host: window.location.hostname,
              storageType: 1,
              description: {
                fi: t('consent.cookies.i18next'),
                sv: t('consent.cookies.i18next'),
                en: t('consent.cookies.i18next'),
              },
              expiration: {
                fi: t('consent.expiration.year'),
                sv: t('consent.expiration.year'),
                en: t('consent.expiration.year'),
              },
            },
            {
              name: 'wordpress_*, wp-settings-*',
              host: 'api.hel.fi',
              storageType: 1,
              description: {
                fi: t('consent.cookies.wordpress'),
                sv: t('consent.cookies.wordpress'),
                en: t('consent.cookies.wordpress'),
              },
              expiration: {
                fi: t('consent.expiration.session'),
                sv: t('consent.expiration.session'),
                en: t('consent.expiration.session'),
              },
            },
            {
              name: 'linkedevents-api-prod-csrftoken',
              host: 'api.hel.fi',
              storageType: 1,
              description: {
                fi: t('consent.cookies.linkedevents'),
                sv: t('consent.cookies.linkedevents'),
                en: t('consent.cookies.linkedevents'),
              },
              expiration: {
                fi: t('consent.expiration.year'),
                sv: t('consent.expiration.year'),
                en: t('consent.expiration.year'),
              },
            },
            {
              name: 'i18next',
              host: 'api.hel.fi',
              storageType: 1,
              description: {
                fi: t('consent.cookies.i18next'),
                sv: t('consent.cookies.i18next'),
                en: t('consent.cookies.i18next'),
              },
              expiration: {
                fi: t('consent.expiration.session'),
                sv: t('consent.expiration.session'),
                en: t('consent.expiration.session'),
              },
            },
          ],
        },
      ],
      optionalGroups: [
        {
          groupId: 'matomo',
          title: {
            fi: t('consent.groups.matomo.title'),
            sv: t('consent.groups.matomo.title'),
            en: t('consent.groups.matomo.title'),
          },
          description: {
            fi: t('consent.groups.matomo.text'),
            sv: t('consent.groups.matomo.text'),
            en: t('consent.groups.matomo.text'),
          },
          expandAriaLabel: {
            fi: t('consent.groups.matomo.expandAriaLabel'),
            sv: t('consent.groups.matomo.expandAriaLabel'),
            en: t('consent.groups.matomo.expandAriaLabel'),
          },
          checkboxAriaDescription: {
            fi: t('consent.groups.matomo.checkboxAriaDescription'),
            sv: t('consent.groups.matomo.checkboxAriaDescription'),
            en: t('consent.groups.matomo.checkboxAriaDescription'),
          },
          cookies: [
            {
              name: '_pk*',
              host: 'digia.fi',
              storageType: 1,
              description: {
                fi: t('consent.cookies.matomo'),
                sv: t('consent.cookies.matomo'),
                en: t('consent.cookies.matomo'),
              },
              expiration: {
                fi: t('consent.expiration.days', { days: 393 }),
                sv: t('consent.expiration.days', { days: 393 }),
                en: t('consent.expiration.days', { days: 393 }),
              },
            },
          ],
        },
      ],
    }),
    [t, appName, language, allowLanguageSwitch, onLanguageChange]
  );

  return (
    <CookieConsentContextProvider
      siteSettings={siteSettings}
      options={{
        cookieDomain: window.location.hostname,
        language,
      }}
      onChange={handleMatomoUpdate}
    >
      <CookieBanner />
    </CookieConsentContextProvider>
  );
};

export default CookieConsent;
