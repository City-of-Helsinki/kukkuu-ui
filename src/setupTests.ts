import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';
import { GlobalWithFetchMock } from 'jest-fetch-mock';
import React from 'react';
import './common/test/testi18nInit';
React.useLayoutEffect = React.useEffect;

// Suppress useLayoutEffect warning from Formik

configure({ adapter: new Adapter() });

const customGlobal: GlobalWithFetchMock = global as GlobalWithFetchMock;
// eslint-disable-next-line @typescript-eslint/no-require-imports
customGlobal.fetch = require('jest-fetch-mock');
customGlobal.fetchMock = customGlobal.fetch;

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn(),
  }),
  useParams: () => ({
    match: jest.fn(),
  }),
}));
