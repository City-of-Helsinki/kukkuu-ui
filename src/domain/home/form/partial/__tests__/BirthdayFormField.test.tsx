import React from 'react';
import { shallow } from 'enzyme';
import { FieldArray } from 'formik';

import BirthdayFormField from '../BirthdayFormField';
import TestForm from '../../../../../common/test/TestForm';

it('renders snapshot correctly', () => {
  const element = shallow(
    <TestForm>
      {() => (
        <FieldArray
          name="foo"
          render={props => <BirthdayFormField {...props} />}
        />
      )}
    </TestForm>
  );
  expect(element.html()).toMatchSnapshot();
});
