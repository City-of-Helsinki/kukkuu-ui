import { screen } from '@testing-library/testcafe';
import { Selector } from 'testcafe';

import { envUrl } from '../utils/settings';
import { deleteChild as childProfilePageDeleteChild } from './childrenProfilePage';
import getDropdownOption from '../utils/getDropdownOption';

export const godchildrenProfilePage = {
  child: (name: string | RegExp) =>
    screen.getAllByRole('heading', {
      name: name,
      level: 4,
      exact: false,
    }),
  editProfileButton: screen.getByRole('button', { name: 'Muokkaa tietojasi' }),
  profileName: Selector('h1'),
  addChildButton: screen.getByRole('button', { name: 'Lisää lapsi' }),
};

export const editProfileModal = {
  container: screen.getByRole('dialog', { name: 'Lähiaikuisen tiedot' }),
  firstNameInput: screen.getByLabelText(/Etunimi/i),
  submitButton: screen.getByRole('button', {
    name: 'Tallenna',
  }),
};

export const addChildModal = {
  container: screen.getByRole('dialog', { name: 'Lisää lapsi' }),
  birthYearInput: screen.getByLabelText(/lisää lapsen syntymävuosi\*/i),
  cityInput: screen.getByLabelText(/lapsen kotipaikkakunta\*/i),
  postalCodeInput: screen.getByLabelText(/postinumero\*/i),
  nameInput: screen.getByLabelText(/lapsen nimi/i),
  relationshipInput: screen.getByRole('combobox', {
    name: /ilmoittajan suhde lapseen/i,
  }),
  submitButton: screen.getByRole('button', {
    name: /lisää lapsi/i,
  }),
};

export const route = () => `${envUrl()}/fi/profile`;

export async function selectChild(
  t: TestController,
  childName: string | RegExp
) {
  await t.click(godchildrenProfilePage.child(childName));
}

export async function addChild(
  t: TestController,
  {
    birthYear,
    city,
    postalCode,
    name,
    relationship,
  }: {
    birthYear: string;
    city: string;
    postalCode: string;
    name: string;
    relationship: string;
  }
) {
  // Open child add modal
  await t.click(godchildrenProfilePage.addChildButton);

  // Assert that the modal has opened and that it adheres to semantic
  // rules
  await t.expect(addChildModal.container.exists).ok();
  await t.wait(1000);
  // Fill form fields
  await t
    .selectText(addChildModal.birthYearInput)
    .typeText(addChildModal.birthYearInput, birthYear)
    .typeText(addChildModal.cityInput, city)
    .typeText(addChildModal.postalCodeInput, postalCode)
    .typeText(addChildModal.nameInput, name)
    .click(addChildModal.relationshipInput)
    .click(getDropdownOption(relationship))
    .click(addChildModal.submitButton);
}

export async function deleteChild(
  t: TestController,
  childName: string | RegExp
) {
  await selectChild(t, childName);
  await childProfilePageDeleteChild(t);
}
