import React from 'react';

import { useLocaleRouteNavigate } from './useLocaleRouteNavigate';

/**
 * Check that the current pathname starts with a current locale.
 * If the current locale is not set in the pathname as the first segment,
 * the router will navigate to such a route and chagne the location pathname.
 */
const WithLocalRoute = (WrappedComponent: React.FC) => {
  return ({ ...props }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLocaleRouteNavigate();
    return <WrappedComponent {...props} />;
  };
};

export default WithLocalRoute;
