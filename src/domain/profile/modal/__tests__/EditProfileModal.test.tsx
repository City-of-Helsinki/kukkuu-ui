import React from 'react';
import toJson from 'enzyme-to-json';
import { MockedProvider } from '@apollo/react-testing';

import EditProfileModal from '../EditProfileModal';
import { ProfileType } from '../../type/ProfileTypes';
import { Language } from '../../../api/generatedTypes/globalTypes';
import { shallowWithProvider } from '../../../../common/test/testUtils';

const initialValues: ProfileType = {
  id: 'yuiop',
  firstName: 'asdf',
  lastName: 'fdsa',
  phoneNumber: '0904422233',
  email: 'email@example.com',
  language: Language.SV,
  children: {
    edges: [],
  },
};

it('renders snapshot correctly', () => {
  const element = shallowWithProvider(
    <MockedProvider>
      <EditProfileModal
        initialValues={initialValues}
        isOpen={true}
        setIsOpen={jest.fn()}
      />
    </MockedProvider>
  );
  expect(toJson(element)).toMatchSnapshot();
});
