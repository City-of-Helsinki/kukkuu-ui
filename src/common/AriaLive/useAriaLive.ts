import { useContext } from 'react';

import AriaLiveContext from './AriaLiveContext';

function useAriaLive() {
  return useContext(AriaLiveContext);
}

export default useAriaLive;
