import React from 'react';
import { useOidcClient } from 'hds-react';
import { IdleTimerProvider } from 'react-idle-timer';

import AppConfig from '../app/AppConfig';

type IdleTimerProps = { children: React.ReactNode };

function IdleTimer({ children }: IdleTimerProps) {
  const { logout, isAuthenticated } = useOidcClient();
  const onIdle = (): void => {
    if (isAuthenticated()) {
      logout();
    }
  };

  return (
    <IdleTimerProvider
      timeout={60 * AppConfig.userIdleTimeoutInMs || 3600000}
      onIdle={onIdle}
      name="att-kukku-ui-idle-timer"
      startOnMount
      crossTab
    >
      {children}
    </IdleTimerProvider>
  );
}

export default IdleTimer;
