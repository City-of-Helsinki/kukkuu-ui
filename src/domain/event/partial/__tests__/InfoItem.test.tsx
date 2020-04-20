import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import InfoItem from '../InfoItem';
import { InfoItem as InfoItemType } from '../OccurrenceInfo';

const infoItem: InfoItemType = {
  id: 'time',
  className: 'class',
  iconSrc: 'iconSource',
  iconAlt: 'Alt text',
  label: 'infoItemLabel',
};

it('renders snapshot correctly', () => {
  const element = shallow(<InfoItem key={1} {...infoItem} />);
  expect(toJson(element)).toMatchSnapshot();
});
