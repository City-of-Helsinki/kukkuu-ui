import { screen } from '@testing-library/testcafe';
import { Selector } from 'testcafe';

export const childrenProfilePage = {
  editChildProfileButton: screen.getByRole('button', {
    name: /muokkaa lapsen tietoja/i,
  }),
  childName: Selector('h1'),
  selectEventGroupButtons: screen.getAllByRole('button', {
    name: 'Selaa tapahtumia',
  }),
};

export const editChildModal = {
  container: screen.getByRole('dialog', { name: 'Muokkaa lapsen tietoja' }),
  nameInput: screen.getByLabelText('Lapsen nimi'),
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
