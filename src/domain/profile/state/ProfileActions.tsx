import { createAction } from '@reduxjs/toolkit';

import { PROFILE_ACTIONS } from '../constants/ProfileActionConstants';
import { ProfileType } from '../type/ProfileTypes';
// eslint-disable-next-line max-len
import { submitChildrenAndGuardian_submitChildrenAndGuardian_guardian as SubmitChildrenAndGuardianType } from '../../api/generatedTypes/submitChildrenAndGuardian';

const saveProfile = createAction<ProfileType | SubmitChildrenAndGuardianType>(
  PROFILE_ACTIONS.SAVE_PROFILE
);

const clearProfile = createAction(PROFILE_ACTIONS.CLEAR_PROFILE);

export { saveProfile, clearProfile };
