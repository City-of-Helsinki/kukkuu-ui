import { screen } from '@testing-library/testcafe';

export const ssoLogin = {
  loginLink: screen.getByText('Helsinki-tunnus'),
  username: screen.getByLabelText('Email'),
  password: screen.getByLabelText('Password'),
  loginButton: screen.getByDisplayValue('Log In'),
  permissionPage: screen.queryByText('Älä anna lupaa'),
  givePermissionButton: screen.getByDisplayValue('Anna lupa'),
};
