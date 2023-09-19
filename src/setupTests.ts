/* eslint-disable import/first */
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
require('dotenv').config({ path: './.env.test' });

import { TextEncoder, TextDecoder } from 'util';

import * as React from 'react';

import setLocale from './common/localization/setLocale';
import './common/test/testi18nInit';
import { server } from './test/msw/server';

import '@testing-library/jest-dom';

// To avoid error: ReferenceError: TextEncoder is not defined
// discussed here: https://github.com/jsdom/jsdom/issues/2524
global.TextEncoder = TextEncoder;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.TextDecoder = TextDecoder as any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(React.useLayoutEffect as any) = React.useEffect;

// Suppress useLayoutEffect warning from Formik

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    match: jest.fn(),
  }),
}));

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
}));

setLocale('fi');

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});
