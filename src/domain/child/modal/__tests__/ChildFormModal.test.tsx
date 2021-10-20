import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';

import ChildFormModal from '../ChildFormModal';
import { defaultRegistrationData } from '../../../registration/state/RegistrationReducers';

it('renders snapshot correctly', () => {
  const initialValues = Object.assign(
    {},
    defaultRegistrationData.formValues.children[0],
    { birthdate: '01-11-2019' }
  );

  const element = shallow(
    <ChildFormModal
      initialValues={initialValues}
      onSubmit={jest.fn()}
      label="foo"
      isOpen={false}
      setIsOpen={jest.fn()}
    />
  );
  expect(toJson(element)).toMatchSnapshot();
});
