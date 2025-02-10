import { customRender as render } from '../../../../common/test/customRender';
import { moreInfoLinks } from '../constants/MoreInfoConstants';
import MoreInfoLinkList from '../MoreInfoLinkList';

it('renders snapshot correctly', () => {
  const { container } = render(<MoreInfoLinkList links={moreInfoLinks} />);
  expect(container).toMatchSnapshot();
});
