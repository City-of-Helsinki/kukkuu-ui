import React from 'react';

import { useLocaleRouteNavigate } from './useLocaleRouteNavigate';

/**
 * Check that the current pathname starts with a current locale.
 * If the current locale is not set in the pathname as the first segment,
 * the router will navigate to such a route and chagne the location pathname.
 */
const WithLocaleRoute = (WrappedComponent: React.FC) => {
  useLocaleRouteNavigate();
  const result = ({ ...props }) => {
    return <WrappedComponent {...props} />;
  };
  result.displayName = `WithLocaleRoute(${
    WrappedComponent.displayName || WrappedComponent.name || 'Unnamed component'
  })`;
  return result;
};

export default WithLocaleRoute;
