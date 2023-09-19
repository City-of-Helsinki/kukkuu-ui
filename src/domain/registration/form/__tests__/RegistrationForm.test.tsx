import RegistrationForm, { FORM_TESTID } from '../RegistrationForm';
import { render, screen } from '../../../../common/test/testingLibraryUtils';

// TODO: Needs mocks for profile query and redux selector.
it.skip('renders snapshot correctly', async () => {
  const { container } = render(<RegistrationForm />);
  expect(await screen.findByTestId(FORM_TESTID));
  expect(container).toMatchSnapshot();
});
