import {
  route,
  godchildrenProfilePage,
  editProfileModal,
} from './pages/godchildrenProfilePage';
import { authorizedGuardian } from './userRoles';
import {
  AuthServiceRequestInterceptor,
  KukkuuApiTestJwtBearerAuthorization,
} from './utils/jwt/mocks/testJWTAuthRequests';
import { browserTestUser } from './utils/jwt/users';

function buildProfile() {
  return { firstName: `Kukkuu ${new Date().toISOString()}` };
}

fixture`Guardian profile feature`
  .requestHooks([
    // Use AuthServiceRequestInterceptor to mock Keycloak out.
    new AuthServiceRequestInterceptor(browserTestUser),
    // Use KukkuuApiTestJwtBearerAuthorization to add auth header to every API request.
    new KukkuuApiTestJwtBearerAuthorization(browserTestUser),
  ])
  .beforeEach(async (t) => {
    // Use authorizedGuardian guardian role to populate session storage
    await t.useRole(authorizedGuardian).navigateTo(route());
    t.ctx.profile = buildProfile();
  })
  .afterEach(async (t) => {
    delete t.ctx.profile;
  });

test('As a guardian I want to edit my profile', async (t) => {
  await t.useRole(authorizedGuardian).navigateTo(route());
  // Open profile edit modal
  await t.click(godchildrenProfilePage.editProfileButton);

  // Assert that the modal has opened and that it adheres to semantic
  // rules
  await t.expect(editProfileModal.container.exists).ok();
  await t.wait(1000);
  await t
    // Select the content of the input so it will be cleared when text
    // is typed
    .selectText(editProfileModal.firstNameInput)
    // Input new name
    .typeText(editProfileModal.firstNameInput, t.ctx.profile.firstName)
    // Submit form
    .click(editProfileModal.submitButton);

  // Expect profile name to have updated
  await t
    .expect(godchildrenProfilePage.profileName.textContent)
    .contains(t.ctx.profile.firstName);
});
