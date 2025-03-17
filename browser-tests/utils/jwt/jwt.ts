import { randomUUID } from 'crypto';

import * as jwt from 'jsonwebtoken';

import type { OIDCUserProfileType } from './types';
import BrowserTestJWTConfig from './config';

const jwtExpirationTimeInSeconds = 1800; // half an hour
/**
 * WARNING: Be careful and try not to leak the JWT signing key!
 * Don't export it and never leak it to the client functions or to browser.
 * Sign the JWT in server or locally and never share it to the browser end.
 * The shared key should be 256 bits.
 */
const _jwtSharedSecret = BrowserTestJWTConfig.jwtSigningSecret;
const _jwtSignAlgorithm = BrowserTestJWTConfig.jwtSignAlgorithm;
/**
 * Get epoch timeframe (from-to) for JWT's timestamp fields.
 * @returns a list of 2 unix timestamps (epochs);
 *  the 1st value is the issued at time and 2nd is expiration time.
 */
export function getEpochTimeframeForTestJWt(
  authTime = new Date()
): [number, number] {
  const issuedAt = Math.round(authTime.getTime() / 1000); // Unit timestamp in seconds
  const expiresAt = issuedAt + jwtExpirationTimeInSeconds;
  return [issuedAt, expiresAt];
}

/**
 * Generate a JWT that can be used with the browser testing.
 * @returns JWT with current timestamps and user information
 */
export function generateTestJwt({
  user,
  prefix,
  issuer = 'https://kukkuu-ui.dev.hel.ninja',
  audience = BrowserTestJWTConfig.oidcApiClientId,
  type = 'Bearer',
  authTime = new Date(),
}: {
  user: OIDCUserProfileType;
  prefix?: string;
  issuer?: string;
  audience?: string;
  authTime?: Date;
  type?: 'Bearer' | 'ID' | 'Refresh';
}) {
  if (!_jwtSharedSecret) {
    throw new Error(
      'A shared secret to sign the test JWT is not configured. ' +
        'Set the BROWSER_TESTS_JWT_SIGN_SECRET with 256 bits key as an environment variable. ' +
        'WARNING: Be careful and try not to leak the JWT signing key!'
    );
  }
  const [issuedAt, expiresAt] = getEpochTimeframeForTestJWt(authTime);
  const payload = {
    iat: issuedAt,
    auth_time: type === 'Refresh' ? undefined : issuedAt,
    exp: expiresAt,
    jti: randomUUID(),
    iss: issuer,
    aud: audience,
    sub: user.sub,
    typ: type,
    authorization: { permissions: [{ scopes: ['access'] }] },
    scope: 'profile email',
    email_verified: false,
    azp: 'kukkuu-ui',
    amr: ['helsinki_tunnus'],
    name: `${user.given_name} ${user.family_name}`,
    preferred_username: user.preferred_username,
    given_name: user.given_name,
    family_name: user.family_name,
    email: user.email,
    loa: 'low',
  };
  const token = jwt.sign(payload, _jwtSharedSecret, {
    algorithm: _jwtSignAlgorithm,
  });
  return { encodedToken: prefix ? `${prefix} ${token}` : token, payload };
}
