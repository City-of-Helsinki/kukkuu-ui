/** Kukkuu API client id in the OIDC service */
export const apiClientId =
  process.env.VITE_OIDC_KUKKUU_API_CLIENT_ID || 'kukkuu-api-dev';
/** The OIDC authority, meaning the URL for the auth service. */
export const oidcAuthority =
  process.env.VITE_OIDC_AUTHORITY ||
  'https://tunnistus.test.hel.ninja/auth/realms/helsinki-tunnistus/';
/** This UI app's OIDC client id in the OIDC service */
export const oidcClientId = process.env.VITE_OIDC_CLIENT_ID || 'kukkuu-ui-dev';
/** OIDC endpoints configuration from the `/.well-known/openid-configuration` */
export const oidcConfigurationEndpoint = `${oidcAuthority}.well-known/openid-configuration`;
/** Kukkuu API GraphQL endpoint */
export const kukkuuApiGraphqlEndpoint =
  process.env.VITE_API_URI || 'https://kukkuu.api.test.hel.ninja/graphql';
