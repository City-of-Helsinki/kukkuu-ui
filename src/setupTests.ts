import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';
import { GlobalWithFetchMock } from 'jest-fetch-mock';

configure({ adapter: new Adapter() });

const customGlobal: GlobalWithFetchMock = global as GlobalWithFetchMock;
// eslint-disable-next-line @typescript-eslint/no-require-imports
customGlobal.fetch = require('jest-fetch-mock');
customGlobal.fetchMock = customGlobal.fetch;
