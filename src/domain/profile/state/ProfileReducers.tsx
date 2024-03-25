import { createReducer } from '@reduxjs/toolkit';

import { MyProfile } from '../types/ProfileQueryTypes';
import { Language } from '../../api/generatedTypes/graphql';
import { clearProfile, saveProfile } from './ProfileActions';

export const defaultProfileData: MyProfile = {
  id: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  language: Language.Fi,
  hasAcceptedMarketing: false,
  children: {
    edges: [],
  },
  languagesSpokenAtHome: {
    edges: [],
  },
};

const reducer = createReducer(defaultProfileData, (builder) => {
  builder
    .addCase(saveProfile, (_state, action: any) => ({ ...action.payload }))
    .addCase(clearProfile, () => ({ ...defaultProfileData }));
});

export default reducer;
