import { render } from '../../../common/test/testingLibraryUtils';
import Layout from '../Layout';

// TODO: Add some apollo mocks
it.skip('renders without crashing', () => {
  const { container } = render(<Layout />);
  expect(container).toMatchSnapshot();
});
