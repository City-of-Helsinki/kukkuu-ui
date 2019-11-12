import React from 'react';
import toJson from 'enzyme-to-json';

import Home from '../Home';
import { mountWithProvider } from '../../../common/test/testUtils';

it('renders snapshot correctly', () => {
  const home = mountWithProvider(<Home />);
  expect(toJson(home)).toMatchSnapshot();
});
