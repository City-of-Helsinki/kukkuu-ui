import { useContext } from 'react';

import cookieConfig from './CookieConfig';

export default function useCookieConfig() {
  return useContext(cookieConfig);
}
