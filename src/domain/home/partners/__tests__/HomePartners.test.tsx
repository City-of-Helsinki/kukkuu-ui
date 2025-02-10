import { customRender as render } from '../../../../common/test/customRender';
import HomePartners from '../HomePartners';

it('renders snapshot correctly', () => {
  const { container } = render(<HomePartners />);
  expect(container).toMatchSnapshot();
});
