import { createAction } from 'redux-starter-kit';

import { PROFILE_ACTIONS } from '../constants/ProfileActionConstants';
import { ProfileType } from '../type/ProfileTypes';

const saveProfile = createAction<ProfileType>(PROFILE_ACTIONS.SAVE_PROFILE);

const clearProfile = createAction(PROFILE_ACTIONS.CLEAR_PROFILE);

export { saveProfile, clearProfile };
