import React from 'react';
import toJson from 'enzyme-to-json';
import { mount } from 'enzyme';

import EditProfileModal from '../EditProfileModal';
import { ProfileType } from '../../type/ProfileTypes';
import { Language } from '../../../api/generatedTypes/globalTypes';

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

const onSubmit = () => {};
const setIsOpen = () => {};

it('renders snapshot correctly', () => {
  const element = mount(
    <EditProfileModal
      initialValues={initialValues}
      onSubmit={onSubmit}
      isOpen={true}
      setIsOpen={setIsOpen}
    />
  );
  expect(toJson(element)).toMatchSnapshot();
});
