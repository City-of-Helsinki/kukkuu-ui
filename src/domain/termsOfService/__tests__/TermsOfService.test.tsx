import { render } from '../../../common/test/testingLibraryUtils';
import TermsOfService from '../TermsOfService';

it('renders snapshot correctly', () => {
  const { container } = render(<TermsOfService />);
  expect(container).toMatchSnapshot();
});
