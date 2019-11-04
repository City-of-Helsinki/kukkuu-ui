import { combineReducers } from 'redux-starter-kit';
import { reducer as oidcReducer } from 'redux-oidc';

import registrationReducer from '../../registration/state/RegistrationReducers';
export default combineReducers({
  authentication: oidcReducer,
  registration: registrationReducer,
});
