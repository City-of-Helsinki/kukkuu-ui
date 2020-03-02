import { createAction } from '@reduxjs/toolkit';

import { PROFILE_ACTIONS } from '../constants/ProfileActionConstants';
import { ProfileType } from '../type/ProfileTypes';
import { submitChildrenAndGuardian_submitChildrenAndGuardian_guardian as submitChildrenAndGuardianType } from '../../api/generatedTypes/submitChildrenAndGuardian';

const saveProfile = createAction<ProfileType | submitChildrenAndGuardianType>(
  PROFILE_ACTIONS.SAVE_PROFILE
);

const clearProfile = createAction(PROFILE_ACTIONS.CLEAR_PROFILE);

export { saveProfile, clearProfile };
