import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';

import PageWrapper from '../PageWrapper';

it('renders snapshot correctly', () => {
  const pageWrapper = shallow(<PageWrapper />);
  expect(toJson(pageWrapper)).toMatchSnapshot();
});
