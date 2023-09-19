import { render } from '../../../../common/test/testingLibraryUtils';
import HomePartners from '../HomePartners';

it('renders snapshot correctly', () => {
  const { container } = render(<HomePartners />);
  expect(container).toMatchSnapshot();
});
