import { createAction } from '@reduxjs/toolkit';

import { PROFILE_ACTIONS } from '../constants/ProfileActionConstants';
import { ProfileType } from '../type/ProfileTypes';
import { SubmitChildrenAndGuardianMutation } from '../../api/generatedTypes/graphql';

type Guardian = NonNullable<
  SubmitChildrenAndGuardianMutation['submitChildrenAndGuardian']
>['guardian'];

const saveProfile = createAction<ProfileType | Guardian>(
  PROFILE_ACTIONS.SAVE_PROFILE
);

const clearProfile = createAction(PROFILE_ACTIONS.CLEAR_PROFILE);

export { saveProfile, clearProfile };
