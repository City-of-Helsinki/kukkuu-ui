import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';

import HomePartners from '../HomePartners';

it('renders snapshot correctly', () => {
  const homePartners = shallow(<HomePartners />);
  expect(toJson(homePartners)).toMatchSnapshot();
});
