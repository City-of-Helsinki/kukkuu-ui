import { Role } from 'testcafe';

import { route } from './pages/frontpage';
import { authorize } from './utils/jwt/clientUtils/login';

/**
 * Use authorizedGuardian user role to populate session storage
 * with the test JWT token.
 *
 * NOTE: The request hooks are also needed to successfully use the test JWT.
 * @example
 * .requestHooks([
 *   // Use AuthServiceRequestInterceptor to mock Keycloak out.
 *   new AuthServiceRequestInterceptor(browserTestUser),
 *   // Use KukkuuApiTestJwtBearerAuthorization to add auth header to every API request.
 *   new KukkuuApiTestJwtBearerAuthorization(browserTestUser),
 * ])
 */
export const authorizedGuardian = Role(route(), async (t) => {
  // eslint-disable-next-line no-console
  console.info('Use "authorizedGuardian" role.');
  await authorize(t);
});
