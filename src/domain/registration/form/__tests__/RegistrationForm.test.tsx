import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import toJson from 'enzyme-to-json';

import RegistrationForm from '../RegistrationForm';
import { shallowWithProvider } from '../../../../common/test/testUtils';

it('renders snapshot correctly', () => {
  const element = shallowWithProvider(
    <MockedProvider>
      <RegistrationForm />
    </MockedProvider>
  );
  expect(toJson(element)).toMatchSnapshot();
});
