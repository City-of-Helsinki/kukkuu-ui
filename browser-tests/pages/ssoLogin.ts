import { screen } from '@testing-library/testcafe';
import { Selector } from 'testcafe';

export const ssoLogin = {
  loginLink: screen.getByText('Helsinki-tunnus'),
  loginLinkShort: screen.getByText('Helusername'),
  username: screen.getByLabelText('Email'),
  password: screen.getByLabelText('Password'),
  loginButton: screen.getByDisplayValue('Log In'),
  permissionPage: screen.queryByText('Älä anna lupaa'),
  givePermissionButton: screen.getByDisplayValue('Anna lupa'),
  localeDropdown: Selector('#kc-locale-dropdown'),
  localeLanguage: 'English',
};
