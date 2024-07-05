import { LoginProviderProps } from 'hds-react';

import AppConfig from '../app/AppConfig';

const providerPropertiesBase: LoginProviderProps = {
  userManagerSettings: {
    authority: AppConfig.oidcAuthority,
    client_id: AppConfig.oidcClientId,
    scope: AppConfig.oidcScope,
    response_type: AppConfig.oidcReturnType,
    redirect_uri: `${AppConfig.origin}/callback`,
    automaticSilentRenew: AppConfig.oidcAutomaticSilentRenew,
    silent_redirect_uri: `${AppConfig.origin}/silent_renew.html`,
    post_logout_redirect_uri: `${AppConfig.origin}/`,
  },
  debug: false,
  sessionPollerSettings: {
    pollIntervalInMs: AppConfig.oidcSessionPollerIntervalInMs,
  },
};

/**
 * HDS LoginProvider configuration when the Kukkuu UI
 * is integrated with Tunnistamo.
 *
 * @deprecated LoginProviderProps for Tunnistamo integration are deprecated,
 * because the Tunnistamo instance will be changed to
 * the Helsinki-Profile Keycloak instance in the near future.
 */
export const tunnistamoPoviderProperties: LoginProviderProps = {
  ...providerPropertiesBase,
  apiTokensClientSettings: {
    url: `${AppConfig.oidcAuthority}api-tokens/`,
    maxRetries: 10,
    retryInterval: 1000,
  },
};

/**
 * HDS LoginProvider configuration when the Kukkuu UI
 * is integrated with Keycloak.
 */
export const keycloakPoviderProperties: LoginProviderProps = {
  ...providerPropertiesBase,
  apiTokensClientSettings: {
    url: `${AppConfig.oidcAuthority}protocol/openid-connect/token`,
    maxRetries: 10,
    retryInterval: 1000,
    queryProps: {
      grantType: 'urn:ietf:params:oauth:grant-type:uma-ticket',
      permission: '#access',
    },
    audiences: AppConfig.oidcAudiences,
  },
};
