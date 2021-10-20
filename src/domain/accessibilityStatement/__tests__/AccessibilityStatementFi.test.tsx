import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import AccessibilityStatementFi from '../AccessibilityStatementFi';

it('renders snapshot correctly', () => {
  const element = shallow(<AccessibilityStatementFi />);
  expect(toJson(element)).toMatchSnapshot();
});
