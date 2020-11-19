import { login } from './utils/login';
import {
  route,
  godchildrenProfilePage,
  editProfileModal,
} from './pages/godchildrenProfilePage';

function buildProfile() {
  return {
    firstName: `Kukkuu ${new Date().toLocaleDateString()}`,
  };
}

fixture`Guardian profile feature`
  .page(route())
  .beforeEach(async (t) => {
    await login(t);
    // Wait in order to allow authentication to complete
    await t.wait(2500); // 2s

    t.ctx.profile = buildProfile();
  })
  .afterEach(async (t) => {
    delete t.ctx.profile;
  });

test('As a guardian I want to edit my profile', async (t) => {
  // Open profile edit modal
  await t.click(godchildrenProfilePage.editProfileButton);

  // Assert that the modal has opened and that it adheres to semantic
  // rules
  await t.expect(editProfileModal.container.exists).ok();

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
