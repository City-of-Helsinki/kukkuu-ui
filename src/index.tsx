// Polyfill for iOS versions that are older than 11.3
// https://sentry.hel.ninja/aok/kukkuu-ui/issues/12094/
import 'finally-polyfill';

import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import './assets/styles/main.scss';
import 'hds-core/lib/base.css';
import Modal from 'react-modal';
import { createBrowserHistory } from 'history';

import BrowserApp from './domain/app/BrowserApp';
import * as serviceWorker from './serviceWorker';
import { initI18next } from './common/translation/i18n/i18nInit';

export const history = createBrowserHistory();

initI18next(history);
Modal.setAppElement('#root');

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.REACT_APP_ENVIRONMENT,
    release: `${process.env.REACT_APP_APPLICATION_NAME}@${process.env.REACT_APP_VERSION}`,
    autoSessionTracking: false,
  });
}

ReactDOM.render(
  <BrowserApp history={history} />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
