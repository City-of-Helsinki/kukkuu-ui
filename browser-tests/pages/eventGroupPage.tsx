import { screen } from '@testing-library/testcafe';
import { Selector } from 'testcafe';

export const eventGroupPage = {
  title: Selector('h1'),
  selectEventButtons: screen.getAllByRole('button', {
    name: 'Lue lisää ja ilmoittaudu tapahtumaan',
  }),
};
