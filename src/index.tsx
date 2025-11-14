import './assets/styles/main.scss';
import 'hds-core/lib/base.css';
import Modal from 'react-modal';
import { createRoot } from 'react-dom/client';
import React from 'react';
import * as Sentry from '@sentry/browser';

import BrowserApp from './domain/app/BrowserApp';
import { initI18next } from './common/translation/i18n/i18nInit';
import AppConfig from './domain/app/AppConfig';
initI18next();
Modal.setAppElement('#root');

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
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
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,
    release: import.meta.env.VITE_SENTRY_RELEASE,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: parseFloat(
      import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || '0'
    ),
    tracePropagationTargets: (
      import.meta.env.VITE_SENTRY_TRACE_PROPAGATION_TARGETS || ''
    ).split(','),
    replaysSessionSampleRate: parseFloat(
      import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE || '0'
    ),
    replaysOnErrorSampleRate: parseFloat(
      import.meta.env.VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE || '0'
    ),
  });
}

const container = document.getElementById('root') as Element;
const root = createRoot(container);

root.render(<BrowserApp cookieDomain={AppConfig.hostname} />);
