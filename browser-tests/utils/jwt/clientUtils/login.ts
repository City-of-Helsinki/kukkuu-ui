import { ClientFunction } from 'testcafe';

import { generateApiTokens, generateOIDCUserData } from '../oidc';
import { browserTestUser } from '../users';
import BrowserTestJWTConfig from '../config';
import HdsLoginProviderStorage from '../storage';
import { OIDCUserDataType, OIDCUserProfileType } from '../types';

// NOTE: The variables used by the ClientFunctions needs to be created in this file
// or otherwise more dependencies are needed by the ClientFunctions.

const apiClientId = BrowserTestJWTConfig.oidcApiClientId;
const userStoreKey = HdsLoginProviderStorage.getUserStoreKey();
const apiTokenUserReferenceKey =
  HdsLoginProviderStorage.apiTokenUserReferenceKey;
const apiTokenStorageKey = HdsLoginProviderStorage.apiTokenStorageKey;

const getOidcUserData = (oidcUser: OIDCUserProfileType) =>
  generateOIDCUserData(oidcUser);
const getApiTokens = (userData: OIDCUserDataType) =>
  generateApiTokens(userData);

const storeOIDCUserResponse = ClientFunction(
  (oidcUserData: OIDCUserDataType) => {
    // eslint-disable-next-line no-console
    console.info('Storing the OIDC user response.', {
      userStoreKey,
      oidcUserData,
    });
    window.sessionStorage.setItem(userStoreKey, JSON.stringify(oidcUserData));
  },
  {
    dependencies: { userStoreKey },
  }
);

const storeApiTokenUserReferece = ClientFunction(
  (apiTokenUserReferenceToken: string) => {
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
    dependencies: { apiTokenUserReferenceKey },
  }
);

const storeApiToken = ClientFunction(
  (apiToken: string) => {
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
    dependencies: { apiTokenStorageKey, apiClientId },
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
 * Fill in the session storage with
 * all the mandatory login related data.
 */
export const authorize = async (
  t: TestController,
  oidcUser: OIDCUserProfileType = browserTestUser
) => {
  hasAuthExpired.with({ boundTestRun: t });
  storeApiTokenUserReferece.with({ boundTestRun: t });
  storeOIDCUserResponse.with({ boundTestRun: t });
  storeApiToken.with({ boundTestRun: t });
  // eslint-disable-next-line no-console
  console.info('Handle the authorization JWT...');
  const hasExpired = await hasAuthExpired();
  if (hasExpired) {
    // eslint-disable-next-line no-console
    console.info(
      'Persisting test JWT to session storage to authorize the user to bypass the login process!',
      {
        userStoreKey,
        oidcUser,
      }
    );
    const oidcUserData = getOidcUserData(oidcUser);
    const { apiToken, apiTokenUserReferenceToken } = getApiTokens(oidcUserData);
    // eslint-disable-next-line no-console
    console.debug('Store OIDC data', {
      oidcUserData: JSON.stringify(oidcUserData),
      userStoreKey,
      apiTokenStorageKey,
      apiTokenUserReferenceKey,
      apiClientId,
      apiToken,
      apiTokenUserReferenceToken,
    });
    await new Promise<void>(async (resolve) => {
      await storeOIDCUserResponse(oidcUserData);
      await storeApiTokenUserReferece(apiTokenUserReferenceToken);
      await storeApiToken(apiToken);
      resolve();
    });
    // eslint-disable-next-line no-console
    console.info(
      'The browser storage has now been populated with OIDC related data!'
    );
  }
  // eslint-disable-next-line no-console
  console.info('Authorization finihed!');
};
