import { createUserManager } from 'redux-oidc';
import { UserManagerSettings } from 'oidc-client';

import { store } from '../app/state/AppStore';
import { fetchApiTokenThunk } from './state/ApiReducer';
import getAuthenticatedUser from './getAuthenticatedUser';

const location = `${window.location.protocol}//${window.location.hostname}${
  window.location.port ? `:${window.location.port}` : ''
}`;

/* eslint-disable @typescript-eslint/camelcase */
const settings: UserManagerSettings = {
  authority: process.env.REACT_APP_OIDC_AUTHORITY,
  client_id: process.env.REACT_APP_OIDC_CLIENT_ID,
  redirect_uri: `${location}/callback`,
  response_type: 'id_token token',
  scope: process.env.REACT_APP_OIDC_SCOPE,
  silent_redirect_uri: `${location}/silent_renew`,
};
/* eslint-enable @typescript-eslint/camelcase */

const userManager = createUserManager(settings);

userManager.events.addUserLoaded(async () => {
  const user = await getAuthenticatedUser();
  store.dispatch(fetchApiTokenThunk(user.access_token));
});

export default userManager;
