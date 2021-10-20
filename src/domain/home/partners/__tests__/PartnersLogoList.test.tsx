import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';

import { mainPartnerList, partnerList } from '../constants/PartnersConstants';
import Partners from '../PartnerLogoList';

it('renders snapshot correctly', () => {
  const mainPartnersLogoList = shallow(
    <Partners partners={mainPartnerList} size="big" />
  );
  expect(toJson(mainPartnersLogoList)).toMatchSnapshot();
  const partnersLogoList = shallow(
    <Partners partners={partnerList} size="small" />
  );
  expect(toJson(partnersLogoList)).toMatchSnapshot();
});
