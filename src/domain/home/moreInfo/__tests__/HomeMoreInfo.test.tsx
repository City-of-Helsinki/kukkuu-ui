import { customRender as render } from '../../../../common/test/customRender';
import HomeMoreInfo from '../HomeMoreInfo';

it('renders snapshot correctly', () => {
  const { container } = render(<HomeMoreInfo />);
  expect(container).toMatchSnapshot();
});
