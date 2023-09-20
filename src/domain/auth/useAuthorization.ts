import React from 'react';

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
