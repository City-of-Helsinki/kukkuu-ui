import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';

import HomeVideo from '../HomeVideo';

it('renders snapshot correctly', () => {
  const homeVideo = shallow(<HomeVideo />);
  expect(toJson(homeVideo)).toMatchSnapshot();
});
