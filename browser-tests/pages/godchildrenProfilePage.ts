import { screen } from '@testing-library/testcafe';
import { Selector } from 'testcafe';

import { envUrl } from '../utils/settings';
import { deleteChild as childProfilePageDeleteChild } from './childrenProfilePage';

export const godchildrenProfilePage = {
  children: screen.getAllByRole('button', {
    name: /Näytä Kummilapsen .* tiedot/,
  }),
  child: (name: string | RegExp) => {
    let labelName;

    if (name instanceof RegExp) {
      labelName = new RegExp(`Näytä Kummilapsen ${name.source} tiedot`);
    } else {
      labelName = `Näytä Kummilapsen ${name} tiedot`;
    }

    return screen.getAllByRole('button', {
      name: labelName,
    });
  },
  editProfileButton: screen.getByRole('button', { name: 'Muokkaa tietoja' }),
  profileName: Selector('h1'),
  addChildButton: screen.getByRole('button', { name: 'Lisää lapsi' }),
};

export const editProfileModal = {
  container: screen.getByRole('dialog', { name: 'Lähiaikuisen tiedot' }),
  firstNameInput: screen.getByLabelText('Etunimi*'),
  submitButton: screen.getByRole('button', {
    name: 'Tallenna',
  }),
};

export const addChildModal = {
  container: screen.getByRole('dialog', { name: 'Lisää lapsi' }),
  birthDayDayInput: screen.getByLabelText('pv'),
  birthDayMonthInput: screen.getByLabelText('kk'),
  birthDayYearInput: screen.getByLabelText('vuosi'),
  cityInput: screen.getByLabelText('Lapsen kotipaikkakunta*'),
  postalCodeInput: screen.getByLabelText('Lapsen postinumero*'),
  firstNameInput: screen.getByLabelText('Lapsen etunimi'),
  lastNameInput: screen.getByLabelText('Lapsen sukunimi'),
  relationshipInput: screen.getByRole('button', {
    name: 'Ilmoittajan suhde lapseen Valitse',
  }),
  submitButton: screen.getByRole('button', { name: 'Lisää lapsi' }),
};

export const route = () => `${envUrl()}/fi/profile`;

export async function selectChild(t, childName: string | RegExp) {
  await t.click(godchildrenProfilePage.child(childName));
}

export async function deleteChild(t, childName: string) {
  await selectChild(t, childName);
  await childProfilePageDeleteChild(t);
}
