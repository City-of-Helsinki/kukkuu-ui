import Button from '../Button';
import { customRender as render } from '../../../test/customRender';

it('renders snapshot correctly', () => {
  const { container } = render(<Button>foo</Button>);
  expect(container).toMatchSnapshot();
});
