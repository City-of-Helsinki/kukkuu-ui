import { customRender as render } from '../../../../common/test/customRender';
import NotEligible from '../NotEligible';

it('renders snapshot correctly', () => {
  const { container } = render(<NotEligible />);
  expect(container).toMatchSnapshot();
});
