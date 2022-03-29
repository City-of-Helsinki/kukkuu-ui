/* eslint-disable import/first */
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
require('dotenv').config({ path: './.env.test' });

import { TextEncoder, TextDecoder } from 'util';

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import React from 'react';
import '@testing-library/jest-dom/extend-expect';

import setLocale from './common/localization/setLocale';
import './common/test/testi18nInit';
import { server } from './test/msw/server';

// To avoid error: ReferenceError: TextEncoder is not defined
// discussed here: https://github.com/jsdom/jsdom/issues/2524
global.TextEncoder = TextEncoder;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.TextDecoder = TextDecoder as any;

React.useLayoutEffect = React.useEffect;

// Suppress useLayoutEffect warning from Formik

Enzyme.configure({ adapter: new Adapter() });

jest.mock('react-router-dom', () => ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),

  useHistory: () => ({
    push: jest.fn(),
  }),
  useParams: () => ({
    match: jest.fn(),
  }),
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
