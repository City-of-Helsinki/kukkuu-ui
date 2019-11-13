import React from 'react';
import { shallow } from 'enzyme';
import { FieldArray } from 'formik';

import BirthdateFormField from '../BirthdateFormField';
import TestForm from '../../../../../common/test/TestForm';

it('renders snapshot correctly', () => {
  const element = shallow(
    <TestForm>
      {() => (
        <FieldArray
          name="foo"
          render={props => <BirthdateFormField {...props} />}
        />
      )}
    </TestForm>
  );
  expect(element.html()).toMatchSnapshot();
});
