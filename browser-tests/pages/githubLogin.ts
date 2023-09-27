import { screen } from '@testing-library/testcafe';

export const githubLogin = {
  loginLink: screen.getByText('GitHub'),
  username: screen.getByLabelText('Username or email address'),
  password: screen.getByLabelText('Password'),
  loginButton: screen.getByDisplayValue('Sign in'),
};
