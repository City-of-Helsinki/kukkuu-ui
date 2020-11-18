import { screen } from '@testing-library/testcafe';
import { Selector } from 'testcafe';

export const childrenProfilePage = {
  editChildProfileButton: screen.getByRole('button', {
    name: 'Muokkaa tietoja',
  }),
  childName: Selector('h1'),
};

export const editChildModal = {
  container: screen.getByRole('dialog', { name: 'Muokkaa lapsen tietoja' }),
  lastNameInput: screen.getByLabelText('Lapsen sukunimi'),
  submitButton: screen.getByRole('button', { name: 'Tallenna' }),
  deleteButton: screen.getByRole('button', { name: 'Poista lapsen tiedot' }),
  confirmDeleteButton: screen.getByRole('button', {
    name: 'Poista lapsen tiedot',
  }),
};

export async function deleteChild(t) {
  await t
    .click(childrenProfilePage.editChildProfileButton)
    .click(editChildModal.deleteButton)
    .click(editChildModal.confirmDeleteButton);
}
