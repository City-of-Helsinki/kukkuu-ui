import './assets/styles/main.scss';
import 'hds-core/lib/base.css';
import Modal from 'react-modal';
import { createRoot } from 'react-dom/client';
import React from 'react';

import BrowserApp from './domain/app/BrowserApp';
import { initI18next } from './common/translation/i18n/i18nInit';
import AppConfig from './domain/app/AppConfig';
import { initSentry } from './utils/sentry';

initI18next();
Modal.setAppElement('#root');

if (AppConfig.isAppInProductionMode) {
  initSentry();
}
const container = document.getElementById('root') as Element;
const root = createRoot(container);

root.render(<BrowserApp cookieDomain={AppConfig.hostname} />);
