import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MockedProvider } from '@apollo/client/testing';

import Welcome from '../Welcome';

it('renders snapshot correctly', () => {
  const element = shallow(
    <MockedProvider>
      <Welcome />
    </MockedProvider>
  );
  expect(toJson(element)).toMatchSnapshot();
});
