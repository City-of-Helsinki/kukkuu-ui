import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Header from '../Header';

it('renders snapshot correctly', () => {
  const header = shallow(<Header />);
  expect(toJson(header)).toMatchSnapshot();
});
