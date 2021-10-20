import * as React from 'react';
import { Route, Redirect, RouteProps, useLocation } from 'react-router-dom';

type Authorization = (() => Promise<boolean>) | boolean;

function useAuthorization(authorization: Authorization): [boolean, boolean] {
  const [isAuthorized, setAuthorized] = React.useState<boolean | null>(null);
  const [isLoading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    let ignore = false;

    if (typeof authorization === 'function') {
      authorization()
        .then((result) => {
          if (!ignore) {
            setAuthorized(result);
          }
        })
        .finally(() => {
          if (!ignore) {
            setLoading(false);
          }
        });
    }

    return () => {
      ignore = true;
    };
  });

  if (typeof authorization === 'boolean') {
    return [false, authorization];
  }

  return [isLoading, Boolean(isAuthorized)];
}

type Props = RouteProps & {
  isAuthorized: Authorization;
  redirectTo?: string;
  loading?: React.ReactElement | null;
};

const ProtectedRoute = ({
  isAuthorized: authorization,
  redirectTo = '/home',
  loading: loadingPlaceholder = null,
  ...rest
}: Props) => {
  const location = useLocation();
  const [loading, isAuthorized] = useAuthorization(authorization);

  if (loading) {
    return loadingPlaceholder;
  }

  if (!isAuthorized) {
    return (
      <Redirect
        to={{
          pathname: redirectTo,
          state: { from: location },
        }}
      />
    );
  }

  return <Route {...rest} />;
};

export default ProtectedRoute;
