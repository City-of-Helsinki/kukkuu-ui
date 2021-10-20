import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import NavigationConfirm from '../NavigationConfirm';

it('renders snapshot correctly', () => {
  const prompt = shallow(<NavigationConfirm isHalfFilling={true} />);
  expect(toJson(prompt)).toMatchSnapshot();
});
