import { RequestHook } from 'testcafe';

import { browserTestUser } from '../users';
import {
  generateTokenEndpointResponse,
  generateUserInfoEndpointResponse,
} from '../oidc';
import {
  OIDCOpenIdConfigurationResponseType,
  OIDCUserProfileType,
} from '../types';
import { generateTestJwt } from '../jwt';
import { route as profileRoute } from '../../../pages/godchildrenProfilePage';
import BrowserTestJWTConfig from '../config';

export class AuthServiceRequestInterceptor extends RequestHook {
  user: OIDCUserProfileType;
  oidcConfigurationPromise: Promise<OIDCOpenIdConfigurationResponseType>;

  /**
   * Mock the authorization process calls in order to use a test JWT.
   *
   * NOTE: A test JWT is needed since the Helsinki-Profile service and it's Keycloak (auth service)
   * does not provide a way to use it with testing.
   *
   * The authorization process:
   * 1. https://tunnistus.test.hel.ninja/auth/realms/helsinki-tunnistus/protocol/openid-connect/auth
   * ?client_id=kukkuu-ui-dev
   * &redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback
   * &response_type=code&scope=openid+profile+email
   * &state=0f40cd89d84448fa922c49b91b35d436
   * &code_challenge=7bejWCa8zAVMJX-tlnuvxN5SxLSWBjAFkysACn56KzQ
   * &code_challenge_method=S256
   * &response_mode=query
   * 2. https://tunnistus.test.hel.ninja/auth/realms/helsinki-tunnistus/login-actions/authenticate
   * ?session_code=MD14QJb6J5nvz05_yKe_nzyyZqiBF2buAbROEjEzRBQ
   * &execution=382feea4-e703-4bfb-a289-61540361e6a2
   * &client_id=kukkuu-ui-dev
   * &tab_id=sBJJtOcKzD4
   * 3. https://tunnistus.test.hel.ninja/auth/realms/helsinki-tunnistus/protocol/openid-connect/token
   * 4. https://tunnistus.test.hel.ninja/auth/realms/helsinki-tunnistus/protocol/openid-connect/userinfo
   *
   */
  constructor(user: OIDCUserProfileType = browserTestUser) {
    // eslint-disable-next-line no-console
    console.info(
      'Using AuthServiceRequestInterceptor to mock out the Helsinki-Profile OIDC requests!',
      { oidcAuthority: BrowserTestJWTConfig.oidcAuthority, user }
    );
    // Filter for every request made to the OIDC authority
    super([BrowserTestJWTConfig.oidcAuthority]);
    this.user = user;
    this.oidcConfigurationPromise = this.fetchOIDCEndpointsConfiguration();
  }

  /**
   * Fetch OIDC endpoints configuration from the `/.well-known/openid-configuration`.
   * @returns a promise of the OIDC endpoints configuration for auth, token and user info.
   */
  async fetchOIDCEndpointsConfiguration() {
    // eslint-disable-next-line no-console
    console.info(
      'Fetching fetchOIDCEndpointsConfiguration from ',
      BrowserTestJWTConfig.oidcConfigurationEndpoint
    );
    return fetch(BrowserTestJWTConfig.oidcConfigurationEndpoint).then(
      (response) =>
        response.json() as unknown as OIDCOpenIdConfigurationResponseType
    );
  }

  async onRequest(requestEvent): Promise<void> {
    /**
     * @example
     * const authEndpoint =
     *   'https://tunnistus.test.hel.ninja/auth/realms/helsinki-tunnistus/protocol/openid-connect/auth';
     * const authenticationEndpoint =
     *   'https://tunnistus.test.hel.ninja/auth/realms/helsinki-tunnistus/login-actions/authenticate';
     * const tokenEndpoint =
     *   'https://tunnistus.test.hel.ninja/auth/realms/helsinki-tunnistus/protocol/openid-connect/token';
     * const userInfoEndpoint =
     *   'https://tunnistus.test.hel.ninja/auth/realms/helsinki-tunnistus/protocol/openid-connect/userinfo';
     */
    const {
      authorization_endpoint: authEndpoint,
      token_endpoint: tokenEndpoint,
      userinfo_endpoint: userInfoEndpoint,
    } = await this.oidcConfigurationPromise;

    if (!authEndpoint || !tokenEndpoint || !userInfoEndpoint) {
      throw new Error(
        'The mandatory OIDC endpoint information could not be fetched! ' +
          'The AuthServiceRequestInterceptor request mocks could not be set.'
      );
    }

    if (requestEvent.requestOptions.url.split('?')[0] === authEndpoint) {
      // Mock auth endpoint to take the user to profile page
      requestEvent.setMock({
        body: undefined,
        status: 307,
        headers: { Location: profileRoute() },
      });
    } else if (requestEvent.requestOptions.url === tokenEndpoint) {
      // Mock api token endpoint to return a test JWT for a given user.
      requestEvent.setMock(generateTokenEndpointResponse(this.user));
    } else if (requestEvent.requestOptions.url === userInfoEndpoint) {
      // Mock api token endpoint to return a test JWT user info for a given user.
      requestEvent.setMock(generateUserInfoEndpointResponse(this.user));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onResponse(responseEvent: object): Promise<void> {
    // This method must also be overridden,
    // but you can leave it blank.
  }
}

export class KukkuuApiTestJwtBearerAuthorization extends RequestHook {
  user: OIDCUserProfileType;
  apiToken: string;

  /**
   * Add a test JWT as an authorization header for every Graphql request made to Kukkuu API.
   * @param user user profile for JWT
   */
  constructor(user: OIDCUserProfileType = browserTestUser) {
    // eslint-disable-next-line no-console
    console.info(
      'Using ApiTestJwtBearerAuthorization to set a test JWT as an authorization header!',
      {
        kukkuuApiGraphqlEndpoint: BrowserTestJWTConfig.kukkuuApiGraphqlEndpoint,
        user,
      }
    );
    // Filter only the API requests
    super([BrowserTestJWTConfig.kukkuuApiGraphqlEndpoint]);
    this.user = user;

    const { encodedToken: apiToken } = generateTestJwt({
      user: this.user,
      prefix: 'Bearer',
      type: 'Bearer',
    });
    this.apiToken = apiToken;
  }

  onRequest(requestEvent): void | Promise<void> {
    requestEvent.requestOptions.headers['Authorization'] = this.apiToken;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onResponse(responseEvent: object): void | Promise<void> {
    // This method must also be overridden,
    // but you can leave it blank.
  }
}
