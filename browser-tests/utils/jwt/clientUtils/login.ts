import { ClientFunction } from 'testcafe';

import * as constants from '../constants';
import * as storage from '../storage';
import { generateApiTokens, generateOIDCUserData } from '../oidc';
import { browserTestUser } from '../user';

// NOTE: The variables used by the ClientFunctions needs to be created in this file
// or otherwise more dependencies are needed by the ClientFunctions.

const apiClientId = constants.apiClientId;
const userStoreKey = storage.getUserStoreKey();
const apiTokenUserReferenceKey = storage.apiTokenUserReferenceKey;
const apiTokenStorageKey = storage.apiTokenStorageKey;
const oidcUser = generateOIDCUserData(browserTestUser);
const { apiToken, apiTokenUserReferenceToken } = generateApiTokens(oidcUser);

const storeOIDCUserResponse = ClientFunction(
  () => {
    // eslint-disable-next-line no-console
    console.info('Storing the OIDC user response.', {
      userStoreKey,
      oidcUser,
    });
    window.sessionStorage.setItem(userStoreKey, JSON.stringify(oidcUser));
  },
  {
    dependencies: { userStoreKey, oidcUser },
  }
);

const storeApiTokenUserReferece = ClientFunction(
  () => {
    // eslint-disable-next-line no-console
    console.info('Storing the API token user reference.', {
      apiTokenUserReferenceKey,
      apiTokenUserReferenceToken,
    });
    window.sessionStorage.setItem(
      apiTokenUserReferenceKey,
      apiTokenUserReferenceToken
    );
  },
  {
    dependencies: { apiTokenUserReferenceKey, apiTokenUserReferenceToken },
  }
);

const storeApiToken = ClientFunction(
  () => {
    // eslint-disable-next-line no-console
    console.info('Storing the API token.', {
      apiTokenStorageKey,
      apiClientId,
      apiToken,
    });
    window.sessionStorage.setItem(
      apiTokenStorageKey,
      JSON.stringify({
        [apiClientId]: apiToken,
        'profile-api-test': 'fetched, but not needed',
      })
    );
  },
  {
    dependencies: { apiTokenStorageKey, apiClientId, apiToken },
  }
);

const hasAuthExpired = ClientFunction(
  () => {
    // eslint-disable-next-line no-console
    console.info('Checking whether the authorization has expired!', {
      userStoreKey,
    });
    try {
      const userResponseAsString = window.sessionStorage.getItem(userStoreKey);
      const storedUserResponse = JSON.parse(userResponseAsString ?? '');
      const hasExpired = storedUserResponse?.expires_at * 1000 < Date.now();
      if (hasExpired) {
        // eslint-disable-next-line no-console
        console.warn('The authorization has expired!');
      }
      return hasExpired;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Could not read a token from the session storage', e);
      return true;
    }
  },
  { dependencies: { userStoreKey } }
);

/**
 * Authorize the user with a symmetrically signed test JWT
 * that is generated only for the browser test purposes.
 */
export const authorize = async (t: TestController) => {
  // eslint-disable-next-line no-console
  console.info('Handle the authorization JWT...');
  const hasExpired = await hasAuthExpired();
  if (hasExpired) {
    // eslint-disable-next-line no-console
    console.info(
      'Persisting test JWT to session storage to authorize the user to bypass the login process!',
      {
        userStoreKey,
      }
    );
    await storeOIDCUserResponse();
    await storeApiTokenUserReferece();
    await storeApiToken();
  }
  // eslint-disable-next-line no-console
  console.info('Authorization finihed!');
};
