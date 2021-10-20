import { render } from '../../../common/test/testingLibraryUtils';
import Profile from '../Profile';

it('renders snapshot correctly', () => {
  const { container } = render(<Profile />);
  expect(container).toMatchSnapshot();
});
