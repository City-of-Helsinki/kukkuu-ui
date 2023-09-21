import * as Sentry from '@sentry/browser';
import './assets/styles/main.scss';
import 'hds-core/lib/base.css';
import Modal from 'react-modal';
import { createRoot } from 'react-dom/client';
import React from 'react';

import BrowserApp from './domain/app/BrowserApp';
import * as serviceWorker from './serviceWorker';
import { initI18next } from './common/translation/i18n/i18nInit';

initI18next();
Modal.setAppElement('#root');

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.REACT_APP_ENVIRONMENT,
    release: `${process.env.REACT_APP_APPLICATION_NAME}@${process.env.REACT_APP_VERSION}`,
    autoSessionTracking: false,
  });
}
const container = document.getElementById('root') as Element;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <BrowserApp />
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
