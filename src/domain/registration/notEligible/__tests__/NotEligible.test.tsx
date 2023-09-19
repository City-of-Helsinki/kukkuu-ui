import { render } from '../../../../common/test/testingLibraryUtils';
import NotEligible from '../NotEligible';

it('renders snapshot correctly', () => {
  const { container } = render(<NotEligible />);
  expect(container).toMatchSnapshot();
});
