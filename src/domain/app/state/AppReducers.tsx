import { combineReducers } from 'redux-starter-kit';
import { reducer as oidcReducer } from 'redux-oidc';

import ApiReducer from '../../auth/state/ApiReducer';
import registrationReducer from '../../registration/state/RegistrationReducers';

const authenticationReducer = combineReducers({
  apiAuthentication: ApiReducer,
  oidcReducer,
});

const rootReducer = combineReducers({
  authentication: authenticationReducer,
  registration: registrationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
