import { combineReducers } from '@reduxjs/toolkit';

import profileReducer from '../../profile/state/ProfileReducers';
import registrationReducer from '../../registration/state/RegistrationReducers';
import EventReducers from '../../event/state/EventReducers';
import EnrolledReducers from '../../event/state/EnrolledReducers';

export default combineReducers({
  enrolled: EnrolledReducers,
  event: EventReducers,
  registration: registrationReducer,
  profile: profileReducer,
});
