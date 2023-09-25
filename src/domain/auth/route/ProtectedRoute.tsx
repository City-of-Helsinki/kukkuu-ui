import * as React from 'react';
import { RouteProps, Navigate, useLocation } from 'react-router-dom';

import type { Authorization } from '../useAuthorization';
import { useAuthorization } from '../useAuthorization';

type Props = Omit<RouteProps, 'lazy' | 'index'> & {
  isAuthorized: Authorization;
  redirectTo?: string;
  loading?: React.ReactElement | null;
};

const ProtectedRoute = ({
  isAuthorized: authorization,
  redirectTo = '/home',
  loading: loadingPlaceholder = null,
  element,
  ...rest
}: Props) => {
  const location = useLocation();
  const [loading, isAuthorized] = useAuthorization(authorization);

  const ProtectedElement = () => {
    if (loading) {
      return loadingPlaceholder;
    }

    if (!isAuthorized) {
      return (
        <Navigate
          to={{
            pathname: redirectTo,
          }}
          state={{ from: location }}
        />
      );
    }
    return element;
  };

  return <ProtectedElement />;
};

export default ProtectedRoute;
