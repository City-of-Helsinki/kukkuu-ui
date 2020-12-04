import { screen } from '@testing-library/testcafe';

export const login = {
  loginButton: screen.getAllByText('Kirjaudu sisään').nth(0),
};
