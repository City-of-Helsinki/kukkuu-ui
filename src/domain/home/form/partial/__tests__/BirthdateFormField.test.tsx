import { FieldArray } from 'formik';

import BirthdateFormField from '../BirthdateFormField';
import TestForm from '../../../../../common/test/TestForm';
import { render } from '../../../../../common/test/testingLibraryUtils';

it('renders snapshot correctly', () => {
  const { container } = render(
    <TestForm>
      <FieldArray
        name="foo"
        render={(props) => <BirthdateFormField {...props} />}
      />
    </TestForm>
  );
  expect(container).toMatchSnapshot();
});
