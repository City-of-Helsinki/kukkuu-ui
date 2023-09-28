import { createUserManager } from 'redux-oidc';
import { UserManagerSettings, Log, WebStorageStateStore } from 'oidc-client';

const location = `${window.location.protocol}//${window.location.hostname}${
  window.location.port ? `:${window.location.port}` : ''
}`;

if (import.meta.env.NODE_ENV === 'development') {
  Log.logger = console;
  Log.level = Log.INFO;
}

const settings: UserManagerSettings = {
  loadUserInfo: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  authority: import.meta.env.VITE_OIDC_AUTHORITY,
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
  redirect_uri: `${location}/callback`,
  // This calculates to 1 minute, good for debugging:
  // accessTokenExpiringNotificationTime: 59.65 * 60,
  automaticSilentRenew: true,
  silent_redirect_uri: `${location}/silent_renew.html`,
  response_type: 'id_token token',
  scope: import.meta.env.VITE_OIDC_SCOPE,
  post_logout_redirect_uri: `${location}/`,
};

const userManager = createUserManager(settings);

export default userManager;
