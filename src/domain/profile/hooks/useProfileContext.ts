import React from 'react';

import { ProfileContext } from '../ProfileContext';

export const useProfileContext = () => {
  const context = React.useContext(ProfileContext);
  if (!context) {
    throw new Error('ProfileContext must be used within a ProfileProvider');
  }
  return context;
};
