import React from 'react';
import { useLocation } from 'react-router';

import { syncCimodeFromLocation } from './cimodeUtils';

/**
 * Hook that listens to route search param changes to automatically
 * enable or disable CIMODE when ?cimode=... is encountered.
 */
export const useCimodeSync = (): void => {
  const location = useLocation();

  React.useEffect(() => {
    syncCimodeFromLocation(location.search);
  }, [location.search]);
};

export default useCimodeSync;
