import { combineReducers } from '@reduxjs/toolkit';

import profileReducer from '../../profile/state/ProfileReducers';
import registrationReducer from '../../registration/state/RegistrationReducers';
import EventReducers from '../../event/state/EventReducers';

export default combineReducers({
  event: EventReducers,
  registration: registrationReducer,
  profile: profileReducer,
});
