import { screen } from '@testing-library/testcafe';
import { testUsername, testUserPassword } from '../utils/settings';

export const loginPage = {
  loginButton: screen.getByText('Log in'),
  username: screen.getByLabelText('Username:'),
  password: screen.getByLabelText('Password:'),
};

export const login = async (t: TestController) => {
  const username = testUsername(), password = testUserPassword();

  await t
    .click(loginPage.loginButton)

  await t
    .typeText(loginPage.username, username)
    .typeText(loginPage.password, password)
    .click(loginPage.loginButton);

  // Wait for authorization to finish
  await t.wait(1000); // 1s
};
