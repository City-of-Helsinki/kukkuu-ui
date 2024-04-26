import { createAction } from '@reduxjs/toolkit';

import { PROFILE_ACTIONS } from '../constants/ProfileActionConstants';
import { MyProfile } from '../types/ProfileQueryTypes';
import { Guardian } from '../../registration/types/SubmitChildrenAndGuardianMutationTypes';

/** @deprecated in favor of GuardianProvider */
const saveProfile = createAction<MyProfile | Guardian>(
  PROFILE_ACTIONS.SAVE_PROFILE
);

/** @deprecated in favor of GuardianProvider */
const clearProfile = createAction(PROFILE_ACTIONS.CLEAR_PROFILE);

export { saveProfile, clearProfile };
