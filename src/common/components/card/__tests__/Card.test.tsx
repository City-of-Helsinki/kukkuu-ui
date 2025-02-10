import { customRender as render } from '../../../test/customRender';
import Card from '../Card';

it('renders snapshot correctly', () => {
  const { container } = render(
    <Card action={vi.fn()} actionText={''} title={''}>
      foo
    </Card>
  );
  expect(container).toMatchSnapshot();
});
