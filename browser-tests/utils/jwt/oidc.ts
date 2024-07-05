import { generateTestJwt, getEpochTimeframeForTestJWt } from './jwt';
import type {
  OIDCTokenEndpointAccessResponseType,
  OIDCTokenEndpointRefreshResponseType,
  OIDCUserInfoResponseType,
  OIDCUserDataType,
  OIDCUserProfileType,
} from './types';

/**
 * Generate the OIDC User data
 * that is stored in the session storage in key
 * `oidc.user:${oidcAuthority}:${oidcClientId}`
 * (use `getUserStoreKey()` to retrieve the storage key).
 * @param user user information
 * @returns session storage value for OIDC user manager
 */
export function generateOIDCUserData(
  user: OIDCUserProfileType
): OIDCUserDataType {
  const authTime = new Date();
  const [, expires_at] = getEpochTimeframeForTestJWt(authTime);
  const { encodedToken: access_token } = generateTestJwt({
    user,
    type: 'Bearer',
    authTime,
  });
  const { encodedToken: id_token, payload: profile } = generateTestJwt({
    user,
    type: 'ID',
    authTime,
  });

  // NOTE: The refresh token might not be needed.
  // const { encodedToken: refresh_token } = generateTestJwt({
  //   user,
  //   type: 'Refresh',
  //   authTime,
  // });

  return {
    access_token,
    expires_at,
    id_token,
    profile,
    // refresh_token,
    scope: 'openid profile email',
    session_state: 'session_state should be mocked out', // example: 'f348b261-e00e-4e8f-b0ec-e84eb0541bec'
    token_type: 'Bearer',
  };
}

/**
 * Generate API tokens that are stored in the session storage for OIDC login provider.
 * @param user user information
 * @returns tokens that can be used to populate session storage api token fields
 */
export function generateApiTokens(userManager: OIDCUserDataType) {
  const { encodedToken: apiToken } = generateTestJwt({
    user: userManager.profile,
    type: 'Bearer',
  });
  const apiTokenUserReferenceToken = userManager.access_token;
  return { apiToken, apiTokenUserReferenceToken };
}

/**
 * Generate a response for authorization service's token endpoint.
 * @param user user information
 * @returns json object of access and refresh tokens with their expiration info
 */
export function generateTokenEndpointResponse(
  user: OIDCUserProfileType
): OIDCTokenEndpointAccessResponseType | OIDCTokenEndpointRefreshResponseType {
  const { encodedToken: access_token, payload: accessTokenPayload } =
    generateTestJwt({
      user,
      type: 'Bearer',
    });

  const { encodedToken: refresh_token, payload: refreshTokenPayload } =
    generateTestJwt({
      user,
      type: 'Refresh',
    });

  return {
    upgraded: false,
    access_token,
    expires_in:
      accessTokenPayload.exp - Math.round(new Date().getTime() / 1000),
    refresh_expires_in:
      refreshTokenPayload.exp - Math.round(new Date().getTime() / 1000),
    refresh_token,
    token_type: 'Bearer',
    'not-before-policy': 0,
  };
}

/**
 * Generate a response for authorization service's user info endpoint.
 * @param user user information
 * @returns response object for user info endpoint request
 */
export function generateUserInfoEndpointResponse(
  user: OIDCUserProfileType
): OIDCUserInfoResponseType {
  return {
    ...user,
  };
}
