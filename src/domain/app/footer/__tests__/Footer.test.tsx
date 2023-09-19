import { render } from '../../../../common/test/testingLibraryUtils';
import Footer from '../Footer';

it('renders snapshot correctly', () => {
  const { container } = render(<Footer />);
  expect(container).toMatchSnapshot();
});
