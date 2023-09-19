import Button from '../Button';
import { render } from '../../../test/testingLibraryUtils';

it('renders snapshot correctly', () => {
  const { container } = render(<Button>foo</Button>);
  expect(container).toMatchSnapshot();
});
