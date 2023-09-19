import { render } from '../../../common/test/testingLibraryUtils';
import AccessibilityStatement from '../AccessibilityStatement';
import AccessibilityStatementFi from '../AccessibilityStatementFi';

it('renders snapshot correctly', () => {
  const { container } = render(
    <AccessibilityStatement>
      <AccessibilityStatementFi />
    </AccessibilityStatement>
  );
  expect(container).toMatchSnapshot();
});
