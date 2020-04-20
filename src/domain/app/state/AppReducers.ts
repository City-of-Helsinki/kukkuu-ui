import { combineReducers } from '@reduxjs/toolkit';

import authenticationReducers from '../../auth/state/AuthenticationReducers';
import profileReducer from '../../profile/state/ProfileReducers';
import registrationReducer from '../../registration/state/RegistrationReducers';
import uiReducers from './ui/UIReducers';
import EventReducers from '../../event/state/EventReducers';
import EnrolledReducers from '../../event/state/EnrolledReducers';

export default combineReducers({
  authentication: authenticationReducers,
  enrolled: EnrolledReducers,
  event: EventReducers,
  registration: registrationReducer,
  profile: profileReducer,
  ui: uiReducers,
});
