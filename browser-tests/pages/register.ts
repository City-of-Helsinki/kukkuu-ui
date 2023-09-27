import { screen } from '@testing-library/testcafe';
import { Selector } from 'testcafe';

export const registerForm = {
  section: Selector('#register'),
  birthDayDayInput: Selector('#child\\.birthdate\\.day'),
  birthDayMonthInput: Selector('#child\\.birthdate\\.month'),
  birthDayYearInput: Selector('#child\\.birthdate\\.year'),
  cityInput: screen.getByLabelText(/Lapsen kotipaikkakunta/i),
  verifyInformationCheckbox: screen.getByLabelText(
    /Vakuutan antamani tiedot oikeaksi/i
  ),
  submitButton: Selector('#register').find('button'),
};

export const registrationForm = {
  formName: Selector('#registrationForm'),
  // Lapsen tiedot
  firstNameInput: screen.getByLabelText('Lapsen etunimi'),
  lastNameInput: screen.getByLabelText('Lapsen sukunimi'),
  postalCodeInput: screen.getByLabelText(/Postinumero/i),
  relationshipInput: screen.getByRole('button', {
    name: /Ilmoittajan suhde lapseen/i,
  }),

  // Lähiaikuisen tiedot
  guardianPhoneNumberInput: screen.getByLabelText(/Puhelinnumero/i),
  languagesSpokenAtHomeCombobox: Selector(
    '#languagesSpokenAtHome-toggle-button'
  ),
  agreeCheckbox: screen.getByLabelText(/Olen tutustunut/),

  submitButton: screen.getByRole('button', { name: 'Ilmoittaudu mukaan' }),
};

export const registrationDone = {
  continueButton: screen.getByRole('button', {
    name: 'Oma kummilapsiprofiili',
  }),
};
