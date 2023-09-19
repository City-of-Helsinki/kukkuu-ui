import { render } from '@testing-library/react';

import FormikDropdown from '../FormikDropdown';
import TestForm from '../../../test/TestForm';

it('renders snapshot correctly', () => {
  const props = {
    id: 'fooSelect',
    name: 'fooSelect',
    label: 'select label',
    onChange: () => jest.fn(),
    options: [
      {
        label: 'foo_label',

        value: 'foo',
      },
      {
        label: 'bar_label',
        value: 'bar',
      },
    ],
  };
  const Dropdown = () => <FormikDropdown {...props} />;
  const { container } = render(<TestForm>{<Dropdown />}</TestForm>);
  expect(container).toMatchSnapshot();
});
