import { customRender as render } from '../../../../common/test/customRender';
import Welcome from '../Welcome';

it('renders snapshot correctly', () => {
  const { container } = render(<Welcome />);
  expect(container).toMatchSnapshot();
});
