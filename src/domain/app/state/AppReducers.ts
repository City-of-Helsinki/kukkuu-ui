import { combineReducers } from 'redux-starter-kit';

import registrationReducer from '../../registration/state/RegistrationReducers';
import authenticationReducers from '../../auth/state/AuthenticationReducers';
export default combineReducers({
  authentication: authenticationReducers,
  registration: registrationReducer,
});
