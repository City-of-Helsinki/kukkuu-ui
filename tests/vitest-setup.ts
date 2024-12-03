/* eslint-disable import/first */
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
require('dotenv').config({ path: './.env.test' });
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import setLocale from '../src/common/localization/setLocale';
import { server } from '../src/test/msw/server';
import '../src/common/test/testi18nInit';

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
