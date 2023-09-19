import { UnconnectedHomePreliminaryForm } from '../HomePreliminaryForm';
import { defaultRegistrationData } from '../../../registration/state/RegistrationReducers';
import { render } from '../../../../common/test/testingLibraryUtils';

const child = {
  birthdate: { day: 1, month: 1, year: 2023 },
  homeCity: 'Helsinki',
};

it('renders snapshot correctly', () => {
  const { container } = render(
    <UnconnectedHomePreliminaryForm
      isAuthenticated={true}
      stateFormValues={defaultRegistrationData.formValues}
      setHomeFormValues={jest.fn()}
      initialValues={{ child, verifyInformation: true }}
      forwardRef={null}
    />
  );
  expect(container).toMatchSnapshot();
});
