import * as React from 'react';
import { Formik } from 'formik';

const TestForm: React.FunctionComponent<{ children?: React.ReactNode }> = (
  props
) => {
  return <Formik onSubmit={vi.fn()} initialValues={{}} {...props} />;
};

export default TestForm;
