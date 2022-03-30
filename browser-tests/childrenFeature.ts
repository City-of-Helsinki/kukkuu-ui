import { login } from './utils/login';
import getDropdownOption from './utils/getDropdownOption';
import {
  route,
  godchildrenProfilePage,
  addChildModal,
  selectChild,
  deleteChild,
} from './pages/godchildrenProfilePage';
import {
  childrenProfilePage,
  editChildModal,
} from './pages/childrenProfilePage';

function buildAddChild() {
  return {
    birthDate: {
      day: '02',
      month: '02',
      year: '2020',
    },
    city: 'Helsinki',
    postalCode: '00000',
    firstName: 'Gilly',
    lastName: 'Girod',
    relationship: 'Vanhempi',
  };
}

function buildEditChild() {
  return {
    lastName: `Citron ${new Date().toLocaleDateString()}`,
  };
}

const childName = /Hertta Citron/;

fixture`Children feature`
  .page(route())
  .beforeEach(async (t) => {
    await login(t);

    t.ctx.addChild = buildAddChild();
    t.ctx.editChild = buildEditChild();
  })
  .afterEach(async (t) => {
    delete t.ctx.addChild;
    delete t.ctx.editChild;
  });

// TODO temporarily disabled
//test('As a guardian I want to see a list of my children and to be able to select one', async (t) => {
//  // The list displays the expected fields
//  await t.expect(godchildrenProfilePage.child(childName).exists).ok();
//  await selectChild(t, childName);
//  await t
//    .expect(childrenProfilePage.childName.textContent)
//    .match(/Hertta Citron .*/);
//});

test('As a guardian I want to edit the details of my child', async (t) => {
  const nextLastName = t.ctx.editChild.lastName;

  // Select child to go to their details
  await selectChild(t, childName);

  // Open child edit modal
  await t.click(childrenProfilePage.editChildProfileButton);

  // Check that the modal is semantically correct
  await t.expect(editChildModal.container.exists).ok();

  await t
    // Select the content of the input so it will be cleared when text
    // is typed
    .selectText(editChildModal.lastNameInput)
    // Input new last name
    .typeText(editChildModal.lastNameInput, nextLastName)
    // save changes
    .click(editChildModal.submitButton);

  // Assert that name has changed
  await t
    .expect(childrenProfilePage.childName.textContent)
    .eql(`Hertta ${nextLastName}`);
});

test('As a guardian I want to add and delete a child', async (t) => {
  const { birthDate, city, postalCode, firstName, lastName, relationship } =
    t.ctx.addChild;
  const newChildName = `${firstName} ${lastName}`;
  const newChildNameRegExp = new RegExp(newChildName);

  // Open child add modal
  await t.click(godchildrenProfilePage.addChildButton);

  // Assert that the modal has opened and that it adheres to semantic
  // rules
  await t.expect(addChildModal.container.exists).ok();

  // Fill form fields
  await t
    .typeText(addChildModal.birthDayDayInput, birthDate.day)
    .typeText(addChildModal.birthDayMonthInput, birthDate.month)
    .typeText(addChildModal.birthDayYearInput, birthDate.year)
    .typeText(addChildModal.cityInput, city)
    .typeText(addChildModal.postalCodeInput, postalCode)
    .typeText(addChildModal.firstNameInput, firstName)
    .typeText(addChildModal.lastNameInput, lastName)
    .click(addChildModal.relationshipInput)
    .click(getDropdownOption(relationship))
    .click(addChildModal.submitButton);

  // Wait a bit extra so the UI has time to complete its refresh
  await t.wait(1500); // 1.5s

  // Assert that the child can be found
  await t.expect(godchildrenProfilePage.child(newChildNameRegExp).exists).ok();

  // Remove the created child
  await deleteChild(t, newChildNameRegExp);
});
