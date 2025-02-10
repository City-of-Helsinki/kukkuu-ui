import { customRender as render } from '../../../common/test/customRender';
import CookieConsentPage from '../CookieConsentPage';

it('renders snapshot correctly', () => {
  const { container } = render(<CookieConsentPage />);
  expect(container).toMatchSnapshot();
});
