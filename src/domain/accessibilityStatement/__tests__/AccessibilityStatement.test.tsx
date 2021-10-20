import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import AccessibilityStatement from '../AccessibilityStatement';
import AccessibilityStatementFi from '../AccessibilityStatementFi';

it('renders snapshot correctly', () => {
  const element = shallow(
    <AccessibilityStatement>
      <AccessibilityStatementFi />
    </AccessibilityStatement>
  );
  expect(toJson(element)).toMatchSnapshot();
});
