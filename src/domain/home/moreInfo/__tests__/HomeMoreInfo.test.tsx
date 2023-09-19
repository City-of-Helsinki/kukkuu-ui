import { render } from '../../../../common/test/testingLibraryUtils';
import HomeMoreInfo from '../HomeMoreInfo';

it('renders snapshot correctly', () => {
  const { container } = render(<HomeMoreInfo />);
  expect(container).toMatchSnapshot();
});
