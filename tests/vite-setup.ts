/* eslint-disable import/first */
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
require('dotenv').config({ path: './.env.test' });
import { beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import setLocale from '../src/common/localization/setLocale';
import { server } from '../src/test/msw/server';

import 'moment/dist/locale/fi';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/vitest';
import '../src/common/test/testi18nInit';

afterEach(() => {
  cleanup();
});

beforeAll(() => {
  setLocale('fi');
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
});
// runs a cleanup after each test case (e.g. clearing jsdom)
afterAll(() => {
  cleanup();
  server.close();
});
