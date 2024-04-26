import { createContext } from 'react';

import { MyProfile } from './types/ProfileQueryTypes';

type ProfileContextType = {
  profile: MyProfile | null;
  clearProfile: () => void;
  updateProfile: React.Dispatch<React.SetStateAction<MyProfile | null>>;
  refetchProfile: () => void;
  loading: boolean;
  fetchCalled: boolean;
};

const defaultContext: ProfileContextType = {
  profile: null,
  loading: false,
  fetchCalled: false,
  clearProfile: () => {
    throw new Error('Not implemented');
  },
  updateProfile: () => {
    throw new Error('Not implemented');
  },
  refetchProfile: () => {
    throw new Error('Not implemented');
  },
};

export const ProfileContext = createContext<ProfileContextType>(defaultContext);
