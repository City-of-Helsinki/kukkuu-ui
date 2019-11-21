import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Welcome from '../Welcome';

it('renders snapshot correctly', () => {
  const element = shallow(<Welcome />);
  expect(toJson(element)).toMatchSnapshot();
});
