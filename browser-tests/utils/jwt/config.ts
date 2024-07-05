import type { Algorithm } from 'jsonwebtoken';

class BrowserTestJWTConfig {
  /**
   * WARNING: Be careful and try not to leak the JWT signing key!
   * Sign the JWT in server or locally and never share it to the browser end.
   * The shared key should be 256 bits.
   */
  private static _jwtSigningSecret: string | null = null;
  static jwtSignAlgorithm: Algorithm = 'HS256';

  /**
   * Retrieves an environment variable's value or throws an error if not found.
   *
   * @param {string} variableName - The name of the environment variable.
   * @param {string} friendlyName - A human-readable name for error messages.
   * @throws {Error} If the environment variable is not defined.
   * @returns {string} The value of the environment variable.
   */
  static getEnvOrError(variableName: string, friendlyName: string): string {
    const value = process.env[variableName];
    if (!value) {
      throw new Error(
        `Environment variable "${friendlyName}" (${variableName}) not found`
      );
    }
    return value;
  }

  /**
   * Kukkuu API's OpenID Connect (OIDC) client ID.
   *
   * Used to identify the Kukkuu API when interacting with the OIDC service.
   *
   * @example
   * // In your environment:
   * VITE_OIDC_KUKKUU_API_CLIENT_ID='kukkuu-api-dev'
   */
  static get oidcApiClientId() {
    return this.getEnvOrError(
      'VITE_OIDC_KUKKUU_API_CLIENT_ID',
      'Kukkuu API OIDC client ID'
    );
  }

  /**
   * The base URL (authority) of the OIDC authentication service.
   *
   * This is the root URL where the OIDC server is hosted.
   *
   * @example
   * // In your environment:
   * VITE_OIDC_AUTHORITY='https://tunnistus.test.hel.ninja/auth/realms/helsinki-tunnistus/'
   */
  static get oidcAuthority() {
    return this.getEnvOrError('VITE_OIDC_AUTHORITY', 'OIDC Authority');
  }

  /**
   * This UI application's OpenID Connect (OIDC) client ID.
   *
   * Used to identify this specific UI application when interacting with the OIDC service.
   *
   * @example
   * // In your environment:
   * VITE_OIDC_CLIENT_ID='kukkuu-ui-dev'
   */
  static get oidcClientId() {
    return this.getEnvOrError('VITE_OIDC_CLIENT_ID', 'OIDC Client ID');
  }

  /**
   * The URL for retrieving OIDC configuration details.
   *
   * This endpoint provides information about the OIDC service, including endpoints and supported capabilities.
   *
   * It is automatically constructed based on the `oidcAuthority`.
   */
  static get oidcConfigurationEndpoint() {
    return `${this.oidcAuthority}.well-known/openid-configuration`;
  }

  /**
   * The GraphQL endpoint for the Kukkuu API.
   *
   * This is the URL used to interact with the Kukkuu API using GraphQL queries and mutations.
   *
   * @example
   * // In your environment:
   * VITE_API_URI='https://kukkuu.api.test.hel.ninja/graphql'
   */
  static get kukkuuApiGraphqlEndpoint() {
    return this.getEnvOrError('VITE_API_URI', 'Kukkuu API URI');
  }

  /**
   * The project year that the browser tests should be targeted.
   */
  static get browserTestProjectYear(): string {
    return process.env.BROWSER_TESTS_PROJECT_YEAR || '1234';
  }

  /**
   * Retrieves the JWT signing secret, fetching it from the environment only once.
   */
  static get jwtSigningSecret(): string {
    if (!this._jwtSigningSecret) {
      this._jwtSigningSecret = this.getEnvOrError(
        'BROWSER_TESTS_JWT_SIGN_SECRET',
        'Shared test JWT signing secret'
      );
    }
    return this._jwtSigningSecret;
  }
}

export default BrowserTestJWTConfig;
