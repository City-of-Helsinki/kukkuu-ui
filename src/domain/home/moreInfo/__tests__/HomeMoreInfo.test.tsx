import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';

import HomeMoreInfo from '../HomeMoreInfo';

it('renders snapshot correctly', () => {
  const homeMoreInfo = shallow(<HomeMoreInfo />);
  expect(toJson(homeMoreInfo)).toMatchSnapshot();
});
