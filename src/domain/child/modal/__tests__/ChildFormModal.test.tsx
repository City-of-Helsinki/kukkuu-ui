import ChildFormModal from '../ChildFormModal';
import { defaultRegistrationData } from '../../../registration/state/RegistrationReducers';
import { render } from '../../../../common/test/testingLibraryUtils';

it('renders snapshot correctly', () => {
  const initialValues = Object.assign(
    {},
    defaultRegistrationData.formValues.children[0],
    { birthdate: '01-11-2019' }
  );

  const { container } = render(
    <ChildFormModal
      initialValues={initialValues}
      onSubmit={vi.fn()}
      label="foo"
      isOpen={false}
      setIsOpen={vi.fn()}
      onCancel={vi.fn()}
    />
  );
  expect(container).toMatchSnapshot();
});
