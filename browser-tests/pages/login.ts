import { screen } from '@testing-library/testcafe';

export const login = {
  loginButton: screen.getByText('Kirjaudu sisään'),
};
