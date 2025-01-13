import * as Sentry from '@sentry/browser';

import AppConfig from '../domain/app/AppConfig';

export function initSentry() {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: AppConfig.environment,
    release: `${import.meta.env.VITE_APPLICATION_NAME}@${import.meta.env.VITE_VERSION}`,
    autoSessionTracking: false,
    beforeSend(event) {
      // Check if the event contains a PERMISSION_DENIED error
      if (event.exception && event.exception.values) {
        const isPermissionDenied = event.exception.values.some(
          (exception) =>
            exception.type === 'GraphQLError' &&
            exception.value?.includes('PERMISSION_DENIED')
        );
        if (isPermissionDenied) {
          // Return null to ignore the event
          return null;
        }
      }
      // Otherwise, send the event to Sentry
      return event;
    },
  });
}
