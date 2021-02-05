import { ssoLogin } from '../pages/ssoLogin';
import { login as loginPage } from '../pages/login';
import { testUsername, testUserPassword } from './settings';

const givePermission = async (t: TestController) => {
  // If the user is show a permission request page
  if (await ssoLogin.permissionPage.exists) {
    // Give permission
    await t.click(ssoLogin.givePermissionButton);
  }
};

export const login = async (t: TestController) => {
  await t
    .click(loginPage.loginButton)
    .click(ssoLogin.loginLink)
    .typeText(ssoLogin.username, testUsername())
    .typeText(ssoLogin.password, testUserPassword())
    .click(ssoLogin.loginButton);

  await givePermission(t);

  await t.wait(2500); // 2,5s
};
