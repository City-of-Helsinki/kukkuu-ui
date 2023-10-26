import { render } from '../../../common/test/testingLibraryUtils';
import CookieConsentPage from '../CookieConsentPage';

it('renders snapshot correctly', () => {
  const { container } = render(<CookieConsentPage />);
  expect(container).toMatchSnapshot();
});
