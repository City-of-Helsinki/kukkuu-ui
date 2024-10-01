import { UnconnectedHomePreliminaryForm } from '../HomePreliminaryForm';
import { defaultRegistrationData } from '../../../registration/state/RegistrationReducers';
import { render } from '../../../../common/test/testingLibraryUtils';

/* const child = {
  birthyear: 2023,
  homeCity: 'Helsinki',
}; */

it('renders snapshot correctly', () => {
  const { container } = render(
    <UnconnectedHomePreliminaryForm
      isAuthenticated={true}
      stateFormValues={defaultRegistrationData.formValues}
      setHomeFormValues={vi.fn()}
      // initialValues={{ child, verifyInformation: true }}
      forwardRef={null}
    />
  );
  expect(container).toMatchSnapshot();
});
