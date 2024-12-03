import { createReducer } from '@reduxjs/toolkit';

import { MyProfile } from '../types/ProfileQueryTypes';
import { Language } from '../../api/generatedTypes/graphql';
import { clearProfile, saveProfile } from './ProfileActions';
import { Guardian } from '../../registration/types/SubmitChildrenAndGuardianMutationTypes';

export const defaultProfileData: MyProfile = {
  id: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  language: Language.Fi,
  hasAcceptedCommunication: false,
  children: {
    edges: [],
  },
  languagesSpokenAtHome: {
    edges: [],
  },
};

const reducer = createReducer<MyProfile | Guardian>(
  defaultProfileData,
  (builder) => {
    builder
      .addCase(saveProfile, (_state, action) => ({
        ...action.payload,
      }))
      .addCase(clearProfile, () => ({ ...defaultProfileData }));
  }
);

/** @deprecated in favor of GuardianProvider */
export default reducer;
