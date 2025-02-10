import { customRender as render } from '../../../../common/test/customRender';
import InfoItem from '../InfoItem';

const infoItem = {
  id: 'time',
  className: 'class',
  icon: <i>iconSource</i>,
  iconAlt: 'Alt text',
  label: 'infoItemLabel',
};

it('renders snapshot correctly', () => {
  const { container } = render(<InfoItem key={1} {...infoItem} />);
  expect(container).toMatchSnapshot();
});
