import { register } from './utils/register';
import {
  route,
  godchildrenProfilePage,
  selectChild,
  deleteChild,
  addChild,
} from './pages/godchildrenProfilePage';
import {
  childrenProfilePage,
  editChildModal,
} from './pages/childrenProfilePage';
import {
  AuthServiceRequestInterceptor,
  KukkuuApiTestJwtBearerAuthorization,
} from './utils/jwt/mocks/testJWTAuthRequests';
import { browserTestUser } from './utils/jwt/users';
import { authorizedGuardian } from './userRoles';
import { EXISTING_PROJECT_YEAR } from './constants';

function buildAddChild() {
  return {
    birthYear: EXISTING_PROJECT_YEAR.toString(),
    city: 'Helsinki',
    postalCode: '00000',
    name: 'Gilly Girod',
    relationship: 'Vanhempi',
  };
}

function buildEditChild() {
  return {
    name: `Hertta Citron ${new Date().toISOString()}`,
  };
}

const childName = /Hertta Citron/;

fixture`Children feature`
  .requestHooks([
    // Use AuthServiceRequestInterceptor to mock Keycloak out.
    new AuthServiceRequestInterceptor(browserTestUser),
    // Use KukkuuApiTestJwtBearerAuthorization to add auth header to every API request.
    new KukkuuApiTestJwtBearerAuthorization(browserTestUser),
  ])
  .beforeEach(async (t) => {
    // Use authorizedGuardian guardian role to populate session storage
    await t.useRole(authorizedGuardian).navigateTo(route());

    await register(t); // this is required first time login only for user

    t.ctx.addChild = buildAddChild();
    t.ctx.editChild = buildEditChild();
  })
  .afterEach(async (t) => {
    delete t.ctx.addChild;
    delete t.ctx.editChild;
  });

// TODO temporarily disabled
test.skip('As a guardian I want to see a list of my children and to be able to select one', async (t) => {
  // The list displays the expected fields
  await t.expect(godchildrenProfilePage.child(childName).exists).ok();
  await selectChild(t, childName);
  await t
    .expect(childrenProfilePage.childName.textContent)
    .match(/Hertta Citron .*/);
});

// test assume children 'Hertta Citron' exists
test('As a guardian I want to edit the details of my child', async (t) => {
  const nextName = t.ctx.editChild.name;

  // Select child to go to their details
  try {
    await selectChild(t, childName);
  } catch {
    // eslint-disable-next-line no-console
    console.warn('The child did not exist yet');

    // Add a child
    await addChild(t, { ...t.ctx.addChild, ...t.ctx.editChild });
  }

  // Open child edit modal
  await t.click(childrenProfilePage.editChildProfileButton);

  // Check that the modal is semantically correct
  await t.expect(editChildModal.container.exists).ok();

  await t
    // Select the content of the input so it will be cleared when text
    // is typed
    .selectText(editChildModal.nameInput)
    .wait(1000) // 1s
    // Input new last name
    .typeText(editChildModal.nameInput, nextName)
    // save changes
    .click(editChildModal.submitButton);

  // Assert that name has changed
  await t.expect(childrenProfilePage.childName.textContent).eql(nextName);
});

test('As a guardian I want to add and delete a child', async (t) => {
  const { name } = t.ctx.addChild;
  const newChildName = name;
  const newChildNameRegExp = new RegExp(newChildName);

  // Add a child
  await addChild(t, t.ctx.addChild);

  // Wait a bit extra so the UI has time to complete its refresh
  await t.wait(1500); // 1.5s

  // Assert that the child can be found
  await t.expect(godchildrenProfilePage.child(newChildNameRegExp).exists).ok();

  // Remove the created child
  await deleteChild(t, newChildNameRegExp);
});
