import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MockedProvider } from '@apollo/client/testing';

import EventIsEnrolled from '../EventIsEnrolled';

it('renders snapshot correctly', () => {
  const element = shallow(
    <MockedProvider>
      <EventIsEnrolled />
    </MockedProvider>
  );
  expect(toJson(element)).toMatchSnapshot();
});
