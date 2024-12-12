/* eslint-disable import/first */
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
require('dotenv').config({ path: './.env.test' });
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';

import setLocale from '../src/common/localization/setLocale';
import { server } from '../src/test/msw/server';
import '../src/common/test/testi18nInit';

// Load error messages for Apollo client so it's easier to debug errors
loadDevMessages();
loadErrorMessages();

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

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
