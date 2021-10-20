import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Container from '../Container';

it('renders snapshot correctly', () => {
  const props = {};
  const container = shallow(<Container children={{ props }} />);
  expect(toJson(container)).toMatchSnapshot();
});
