/* eslint-disable import/first */
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
require('dotenv').config({ path: './.env.test' });

import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
// import { GlobalWithFetchMock } from 'jest-fetch-mock';
import React from 'react';
import '@testing-library/jest-dom/extend-expect';

import setLocale from './common/localization/setLocale';
import './common/test/testi18nInit';
import { server } from './test/msw/server';

React.useLayoutEffect = React.useEffect;

// Suppress useLayoutEffect warning from Formik

Enzyme.configure({ adapter: new Adapter() });

// const customGlobal: GlobalWithFetchMock = global as GlobalWithFetchMock;
// // eslint-disable-next-line @typescript-eslint/no-require-imports
// customGlobal.fetch = require('jest-fetch-mock');
// customGlobal.fetchMock = customGlobal.fetch;

jest.mock('react-router-dom', () => ({
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
