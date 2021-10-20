import { render } from '../../../../common/test/testingLibraryUtils';
import Welcome from '../Welcome';

it('renders snapshot correctly', () => {
  const { container } = render(<Welcome />);
  expect(container).toMatchSnapshot();
});
