import React from 'react';

export type CookieConfigProps = {
  cookieDomain: string;
};

const defaultCookieDomain = '';

// eslint-disable-next-line @eslint-react/naming-convention-context-name
const CookieConfig = React.createContext<CookieConfigProps>({
  cookieDomain: defaultCookieDomain,
});

export default CookieConfig;
