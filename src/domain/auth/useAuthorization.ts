import React from 'react';
import * as Sentry from '@sentry/browser';

export type Authorization = (() => Promise<boolean>) | boolean;

export function useAuthorization(
  authorization: Authorization
): [boolean, boolean] {
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
        .catch((error) => {
          // A failed authorization check is critical: the user may be
          // denied access to a protected route.
          Sentry.captureException(error);
          if (!ignore) {
            setAuthorized(false);
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
  }, [authorization]);

  if (typeof authorization === 'boolean') {
    return [false, authorization];
  }

  return [isLoading, Boolean(isAuthorized)];
}
