/* eslint-disable import/first */
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
require('dotenv').config({ path: './.env.test' });

import Modal from 'react-modal';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';

import setLocale from '../src/common/localization/setLocale';
import { server } from '../src/test/msw/server';
import '../src/common/test/testi18nInit';

// Load error messages for Apollo client so it's easier to debug errors
loadDevMessages();
loadErrorMessages();

// Set an appElement for react-modal for tests. For production it is set in
// src/index.tsx. Otherwise react-modal raises warning:
//
// "Warning: react-modal: App element is not defined. Please use
// `Modal.setAppElement(el)` or set `appElement={el}`. This is needed so screen
// readers don't see main content when modal is opened. It is not recommended,
// but you can opt-out by setting `ariaHideApp={false}`."
Modal.setAppElement(document.createElement('div'));

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockScrollTo = vi.fn((x?: number | ScrollToOptions, y?: number) => {});

window.scrollTo = mockScrollTo;

beforeAll(() => {
  setLocale('fi');
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});
