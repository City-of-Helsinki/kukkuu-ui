import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';

import { moreInfoLinks } from '../constants/MoreInfoConstants';
import MoreInfoLinkList from '../MoreInfoLinkList';

it('renders snapshot correctly', () => {
  const mainPartnersLogoList = shallow(
    <MoreInfoLinkList links={moreInfoLinks} />
  );
  expect(toJson(mainPartnersLogoList)).toMatchSnapshot();
});
