import { createContext } from 'react';

import { MyProfile } from './types/ProfileQueryTypes';

export type ProfileType = MyProfile | null;
export type UpdateProfileType = React.Dispatch<
  React.SetStateAction<ProfileType>
>;

export type ProfileContextType = {
  profile: ProfileType;
  clearProfile: () => void;
  updateProfile: UpdateProfileType;
  refetchProfile: () => void;
  isLoading: boolean;
  isFetchCalled: boolean;
};

const defaultContext: ProfileContextType = {
  profile: null,
  isLoading: false,
  isFetchCalled: false,
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
