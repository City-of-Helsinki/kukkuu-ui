import { createReducer } from 'redux-starter-kit';

import { PROFILE_ACTIONS } from '../constants/ProfileActionConstants';
import { ProfileType } from '../type/ProfileTypes';

export const defaultProfileData: ProfileType = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  children: null,
};

export default createReducer(defaultProfileData, {
  [PROFILE_ACTIONS.SAVE_PROFILE]: (state, action) => {
    state = action.payload;
  },
  [PROFILE_ACTIONS.CLEAR_PROFILE]: state => {
    state = defaultProfileData;
  },
});
