import React from 'react';
import { shallow } from 'enzyme';

import { UnconnectedRegistrationForm } from '../RegistrationForm';
import { defaultRegistrationData } from '../../state/RegistrationReducers';

it('renders snapshot correctly', () => {
  const element = shallow(
    <UnconnectedRegistrationForm
      setFormValues={jest.fn()}
      initialValues={defaultRegistrationData.formValues}
    />
  );
  expect(element.html()).toMatchSnapshot();
});
