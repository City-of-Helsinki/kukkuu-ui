import { render } from '../../../test/testingLibraryUtils';
import Card from '../Card';

it('renders snapshot correctly', () => {
  const { container } = render(
    <Card action={vi.fn()} actionText={''} title={''}>
      foo
    </Card>
  );
  expect(container).toMatchSnapshot();
});
