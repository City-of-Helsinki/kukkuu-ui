import { screen } from '@testing-library/testcafe';
import { Selector } from 'testcafe';

import { envUrl } from '../utils/settings';
import { deleteChild as childProfilePageDeleteChild } from './childrenProfilePage';

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
  birthDayDayInput: screen.getByLabelText('pv'),
  birthDayMonthInput: screen.getByLabelText('kk'),
  birthDayYearInput: screen.getByLabelText('vuosi'),
  cityInput: screen.getByRole('textbox', {
    name: /lapsen kotipaikkakunta/i,
  }),
  postalCodeInput: screen.getByLabelText(/postinumero/i),
  firstNameInput: screen.getByLabelText('Lapsen etunimi'),
  lastNameInput: screen.getByLabelText('Lapsen sukunimi'),
  relationshipInput: screen.getByRole('button', {
    name: /ilmoittajan suhde lapseen/i,
  }),
  submitButton: screen.getByRole('button', { name: 'Lisää lapsi' }),
};

export const route = () => `${envUrl()}/fi/profile`;

export async function selectChild(
  t: TestController,
  childName: string | RegExp
) {
  await t.click(godchildrenProfilePage.child(childName));
}

export async function deleteChild(
  t: TestController,
  childName: string | RegExp
) {
  await selectChild(t, childName);
  await childProfilePageDeleteChild(t);
}
