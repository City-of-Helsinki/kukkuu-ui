import React from 'react';
import { LoginProvider, SessionEndedHandler } from 'hds-react';
import { useTranslation } from 'react-i18next';

import {
  keycloakPoviderProperties,
  tunnistamoPoviderProperties,
} from './constants';
import AppConfig from '../app/AppConfig';

type KukkuuHDSLoginProviderProps = { children: React.ReactNode };

function KukkuuHDSLoginProvider({ children }: KukkuuHDSLoginProviderProps) {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const providerProperties =
    AppConfig.oidcServerType === 'TUNNISTAMO'
      ? tunnistamoPoviderProperties
      : keycloakPoviderProperties;

  return (
    <LoginProvider
      {...providerProperties}
      userManagerSettings={{
        ...providerProperties.userManagerSettings,
        // Define what language to use in the (external) login page
        ui_locales: language,
      }}
    >
      {children}
      <SessionEndedHandler
        content={{
          title: t('authentication.session.expired.label'),
          text: t('authentication.session.expired.message'),
          buttonText: t('authentication.logout.text'),
          closeButtonLabelText: t('authentication.logout.text'),
        }}
      />
    </LoginProvider>
  );
}

export default KukkuuHDSLoginProvider;
