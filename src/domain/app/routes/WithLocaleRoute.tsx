import React from 'react';

import { useLocaleRouteNavigate } from './useLocaleRouteNavigate';

type Props = {
  Component: React.FC;
};

const WithLocaleRouteComponent = ({ Component, ...rest }: Props) => {
  useLocaleRouteNavigate();
  return <Component {...rest} />;
};

/**
 * Check that the current pathname starts with a current locale.
 * If the current locale is not set in the pathname as the first segment,
 * the router will navigate to such a route and chagne the location pathname.
 */
const WithLocaleRoute = (WrappedComponent: React.FC) => {
  const result = ({ ...props }) => {
    return <WithLocaleRouteComponent Component={WrappedComponent} {...props} />;
  };
  result.displayName = `WithLocaleRoute(${
    WrappedComponent.displayName || WrappedComponent.name || 'Unnamed component'
  })`;
  return result;
};

export default WithLocaleRoute;
