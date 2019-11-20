import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import NotEligible from '../notEligible';

it('renders snapshot correctly', () => {
  const element = shallow(<NotEligible />);
  expect(toJson(element)).toMatchSnapshot();
});
