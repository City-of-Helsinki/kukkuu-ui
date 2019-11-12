import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Layout from '../Layout';

it('renders snapshot correctly', () => {
  const layout = shallow(
    <Layout>
      <></>
    </Layout>
  );
  expect(toJson(layout)).toMatchSnapshot();
});
