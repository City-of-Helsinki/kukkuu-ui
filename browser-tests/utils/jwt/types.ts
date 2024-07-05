/**
 * The OIDC user profile type.
 */
export type OIDCUserProfileType = {
  sub: string;
  preferred_username: string;
  email: string;
  given_name: string;
  family_name: string;
};

/**
 * OIDC User profile and tokens information that is stored in the session storage.
 */
export type OIDCUserDataType = {
  access_token: string;
  expires_at: number;
  id_token: string;
  profile: OIDCUserProfileType;
  refresh_token?: string;
  scope: string;
  session_state?: string;
  token_type: 'Bearer';
};

/**
 * Response from authorization service `/.well-known/openid-configuration` endpoint.
 */
export type OIDCOpenIdConfigurationResponseType = {
  // "issuer": "https://tunnistus.test.hel.ninja/auth/realms/helsinki-tunnistus"
  issuer: string;
  // "authorization_endpoint":
  //    "https://tunnistus.test.hel.ninja/auth/realms/helsinki-tunnistus/protocol/openid-connect/auth"
  authorization_endpoint: string;
  // "token_endpoint": "https://tunnistus.test.hel.ninja/auth/realms/helsinki-tunnistus/protocol/openid-connect/token"
  token_endpoint: string;
  // "userinfo_endpoint":
  //    "https://tunnistus.test.hel.ninja/auth/realms/helsinki-tunnistus/protocol/openid-connect/userinfo"
  userinfo_endpoint: string;
  // "end_session_endpoint": "
  //    "https://tunnistus.test.hel.ninja/auth/realms/helsinki-tunnistus/protocol/openid-connect/logout"
  end_session_endpoint: string;
  // ... NOTE: many more fields exists, but those are not needed.
};

/**
 * Response from authorization service `/userinfo` endpoint.
 */
export type OIDCUserInfoResponseType = OIDCUserProfileType & {
  email_verified?: boolean;
  amr?: string[];
  loa?: 'low';
};

/**
 * Response from authorization service `/token` endpoint on first access.
 */
export type OIDCTokenEndpointAccessResponseType = {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: 'Bearer';
  id_token: string;
  'not-before-policy': 0;
  session_state: string;
  scope: 'openid add-ad-groups-claim profile email';
};

/**
 * Response from authorization service `/token` endpoint on token refresh.
 */
export type OIDCTokenEndpointRefreshResponseType = {
  upgraded: boolean;
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: 'Bearer';
  'not-before-policy': 0;
};
