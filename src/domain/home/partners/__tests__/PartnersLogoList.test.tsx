import { render } from '../../../../common/test/testingLibraryUtils';
import { mainPartnerList, partnerList } from '../constants/PartnersConstants';
import Partners from '../PartnerLogoList';

it('renders snapshot correctly', () => {
  const { container: smallContainer } = render(
    <Partners partners={mainPartnerList} size="big" />
  );
  expect(smallContainer).toMatchSnapshot();
  const { container: bigContainer } = render(
    <Partners partners={partnerList} size="small" />
  );
  expect(bigContainer).toMatchSnapshot();
});
