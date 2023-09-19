import * as React from 'react';
import { Formik } from 'formik';

const TestForm: React.FunctionComponent<{ children?: React.ReactNode }> = (
  props
) => {
  return <Formik onSubmit={jest.fn()} initialValues={{}} {...props} />;
};

export default TestForm;
