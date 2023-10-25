import { createReducer } from '@reduxjs/toolkit';

import { ProfileType } from '../type/ProfileTypes';
import { Language } from '../../api/generatedTypes/globalTypes';
import { clearProfile, saveProfile } from './ProfileActions';

export const defaultProfileData: ProfileType = {
  id: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  language: Language.FI,
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
