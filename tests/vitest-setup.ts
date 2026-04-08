 
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config({ path: './.env.test' });

import { VirtualConsole } from 'jsdom';
import Modal from 'react-modal';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';

import setLocale from '../src/common/localization/setLocale';
import { server } from '../src/test/msw/server';
import '../src/common/test/testi18nInit';

// Suppress jsdom CSS parse errors at the VirtualConsole level
const originalEmit = VirtualConsole.prototype.emit;
VirtualConsole.prototype.emit = function (event: string, ...args: unknown[]) {
  if (
    event === 'jsdomError' &&
    args[0] instanceof Error &&
    args[0].message.includes('Could not parse CSS stylesheet')
  ) {
    return false;
  }
  return originalEmit.call(this, event, ...args);
};

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

class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;

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
