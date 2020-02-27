import React from 'react';
import { shallow } from 'enzyme';

import Card from '../Card';

it('renders snapshot correctly', () => {
  const card = shallow(<Card>foo</Card>);
  expect(card.html()).toMatchSnapshot();
});
