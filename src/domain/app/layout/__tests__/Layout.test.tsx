import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import PageLayout from '../PageLayout';

it('renders snapshot correctly', () => {
  const layout = shallow(
    <PageLayout>
      <></>
    </PageLayout>
  );
  expect(toJson(layout)).toMatchSnapshot();
});
