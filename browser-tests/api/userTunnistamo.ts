import { Selector } from 'testcafe';
import { screen } from '@testing-library/testcafe';
import { apiUrl, testUsername, testUserPassword } from '../utils/settings';
import { login as apiLogin } from './login';

export const user = {
  username: `${testUsername()}`,
  password: `${testUserPassword()}`,
  selectByUsername: Selector('tr').withText(`${testUsername()}`),
  selectByEmail: Selector('.field-email')
    .withText(`${testUsername()}`)
    .sibling('.field-username')
    .child('a'),
  // user change
  staffStatus: screen.getByLabelText(/Ylläpitäjä|Staff status/i),
  staffStatusCheckbox: Selector('#id_is_staff'),
  superUserStatus: screen.getByLabelText(/Pääkäyttäjä|Superuser status/i),
  superUserStatusCheckbox: Selector('#id_is_superuser'),
  chooseAllPermissions: Selector('#id_user_permissions_add_all_link'),

  saveButton: screen.getByText(/Tallenna ja poistu|Save/i),
};

export const routeLogin = () => `${apiUrl()}/admin/`;
export const routeUser = () => `${apiUrl()}/admin/users/user/`;

export const tunnistamoUserAccesses = async (t: TestController) => {
  // api url has to be configured
  if (!apiUrl()) {
    return;
  }

  await t.navigateTo(routeLogin());

  await apiLogin(t);

  await t.navigateTo(routeUser());

  await t.click(user.selectByEmail);

  // these needs to be checked
  if (!(await user.staffStatusCheckbox.checked)) {
    await t.click(user.staffStatus);
  }
  if (!(await user.superUserStatusCheckbox.checked)) {
    await t.click(user.superUserStatus);
  }

  await t.click(user.chooseAllPermissions).click(user.saveButton);
};
