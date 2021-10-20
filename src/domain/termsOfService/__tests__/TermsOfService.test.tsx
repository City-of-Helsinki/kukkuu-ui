import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import TermsOfService from '../TermsOfService';

it('renders snapshot correctly', () => {
  const element = shallow(<TermsOfService />);
  expect(toJson(element)).toMatchSnapshot();
});
