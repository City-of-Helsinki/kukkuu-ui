import * as Sentry from '@sentry/browser';
import './assets/styles/main.scss';
import 'hds-core/lib/base.css';
import Modal from 'react-modal';
import { createRoot } from 'react-dom/client';
import React from 'react';

import BrowserApp from './domain/app/BrowserApp';
import * as serviceWorker from './serviceWorker';
import { initI18next } from './common/translation/i18n/i18nInit';
import AppConfig from './domain/app/AppConfig';

initI18next();
Modal.setAppElement('#root');

if (import.meta.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_ENVIRONMENT,
    release: `${import.meta.env.VITE_APPLICATION_NAME}@${
      import.meta.env.VITE_VERSION
    }`,
    autoSessionTracking: false,
  });
}
const container = document.getElementById('root') as Element;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserApp cookieDomain={AppConfig.hostname} />
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
