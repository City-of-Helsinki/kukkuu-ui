import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import { processSilentRenew } from 'redux-oidc';
import './assets/styles/main.scss';
import 'hds-core/lib/helsinki.css';
import Modal from 'react-modal';

import BrowserApp from './domain/app/BrowserApp';
import * as serviceWorker from './serviceWorker';

import './common/translation/i18n/i18nInit';
Modal.setAppElement('#root');

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.REACT_APP_SENTRY_ENVIRONMENT,
    release: `${process.env.REACT_APP_APPLICATION_NAME}@${process.env.REACT_APP_VERSION}`,
  });
}
if (window.location.pathname === '/silent_renew') {
  processSilentRenew();
} else {
  ReactDOM.render(<BrowserApp />, document.getElementById('root'));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
