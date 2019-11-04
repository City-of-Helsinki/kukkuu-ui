import { combineReducers } from 'redux-starter-kit';
import { reducer as oidcReducer } from 'redux-oidc';

import apiReducer from '../../auth/state/ApiReducer';
import registrationReducer from '../../registration/state/RegistrationReducers';

const authenticationReducer = combineReducers(oidcReducer, ApiReducer);

const rootReducer = combineReducers({
  authentication: authReducer,
  oidc: oidcReducer,
  registration: registrationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
