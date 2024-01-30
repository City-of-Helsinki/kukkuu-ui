import React from 'react';

import type { CookieConfigProps } from './CookieConfig';
import CookieConfig from './CookieConfig';

export type CookieConfigProviderProps = CookieConfigProps & {
  children: React.ReactNode;
};

export default function CookieConfigProvider({
  cookieDomain,
  children,
}: CookieConfigProviderProps) {
  const context = { cookieDomain };
  return (
    <CookieConfig.Provider value={context}>{children}</CookieConfig.Provider>
  );
}
