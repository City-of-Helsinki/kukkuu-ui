import { ssoLogin } from '../pages/ssoLogin';
import { githubLogin } from '../pages/githubLogin';
import { testUsername, testUserPassword } from './settings';

const givePermission = async (t: TestController) => {
  // If the user is show a permission request page
  if (await ssoLogin.permissionPage.exists) {
    // Give permission
    await t.click(ssoLogin.givePermissionButton);
  }
};

export const login = async (t: TestController) => {
  // @ts-ignore
  const developmentMode = t.testRun.opts.developmentMode

  //  development mode, use github login
  if (developmentMode) {
    console.log("GitHub login")
    await t
      .click(githubLogin.loginLink)
      .typeText(githubLogin.username, testUsername())
      .typeText(githubLogin.password, testUserPassword())
      .click(githubLogin.loginButton);

    // when device verification  is needed this timeout is to manual response
    // it is recommended to use github mobile for device verification
    await t.wait(20000); // 20s
  }
  // sso login used by ci builds
  else {
    console.log("Helsinki-tunnus login")
    await t
      .click(ssoLogin.loginLink)
      .typeText(ssoLogin.username, testUsername())
      .typeText(ssoLogin.password, testUserPassword())
      .click(ssoLogin.loginButton);

    await givePermission(t);

    await t.wait(3500); // 3.5s
  }
};
