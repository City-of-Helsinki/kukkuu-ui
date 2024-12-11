import {
  registerForm,
  registrationForm,
  registrationDone,
} from '../pages/register';
import getDropdownOption from './getDropdownOption';
import { EXISTING_PROJECT_YEAR } from '../constants';

// Firstime sign up requires registration
export const register = async (t: TestController) => {
  const registerChild = {
    birthYear: EXISTING_PROJECT_YEAR.toString(),
    city: 'Helsinki',
    postalCode: '00000',
    name: 'Hertta Citron',
    relationship: 'Vanhempi',
  };
  const guardian = {
    phoneNumber: '0000000000',
    language: 'suomi',
  };

  if (await registerForm.section.exists) {
    // eslint-disable-next-line no-console
    console.log('Register user');

    await t
      .selectText(registerForm.birthYearInput)
      .typeText(registerForm.birthYearInput, registerChild.birthYear)
      .typeText(registerForm.cityInput, registerChild.city)
      .click(registerForm.verifyInformationCheckbox)
      .click(registerForm.submitButton);

    await t.wait(2500); // 2.5s

    if (await registrationForm.formName.exists) {
      await t
        .typeText(registrationForm.nameInput, registerChild.name)
        .typeText(registrationForm.postalCodeInput, registerChild.postalCode)
        .click(registrationForm.relationshipInput)
        .click(getDropdownOption(registerChild.relationship))
        .click(registrationForm.agreeCheckbox)
        .click(registrationForm.languagesSpokenAtHomeCombobox)
        .click(getDropdownOption('ruotsi'))
        // .click(getDropdownOption(guardian.language))
        .typeText(
          registrationForm.guardianPhoneNumberInput,
          guardian.phoneNumber
        )
        .click(registrationForm.submitButton);

      await t.wait(2500); // 2.5s

      await t.click(registrationDone.continueButton);

      await t.wait(2500); // 2.5s
    }
  }
};
