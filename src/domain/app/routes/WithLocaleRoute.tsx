import React from 'react';

import { useLocaleRouteNavigate } from './useLocaleRouteNavigate';

const WithLocaleRouteComponent = ({ Component, ...rest }: any) => {
  useLocaleRouteNavigate();
  return <Component {...rest} />;
};

/**
 * Check that the current pathname starts with a current locale.
 * If the current locale is not set in the pathname as the first segment,
 * the router will navigate to such a route and chagne the location pathname.
 */
const WithLocaleRoute = (WrappedComponent: React.FC) => {
  return ({ ...props }) => {
    return <WithLocaleRouteComponent Component={WrappedComponent} {...props} />;
  };
};

export default WithLocaleRoute;
