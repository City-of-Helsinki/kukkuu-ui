import { combineReducers } from 'redux-starter-kit';
import { reducer as oidcReducer } from 'redux-oidc';

import authReducer from '../../auth/redux';

import registrationReducer from '../../registration/state/RegistrationReducers';

const rootReducer = combineReducers({
  auth: authReducer,
  oidc: oidcReducer,
  registration: registrationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;