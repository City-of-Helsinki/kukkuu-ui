import React from 'react';

export type CookieConfigProps = {
  cookieDomain: string;
};

const defaultCookieDomain = '';

const CookieConfig = React.createContext<CookieConfigProps>({
  cookieDomain: defaultCookieDomain,
});

export default CookieConfig;
