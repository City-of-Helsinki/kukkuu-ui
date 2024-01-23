import {
  registerForm,
  registrationForm,
  registrationDone,
} from '../pages/register';
import getDropdownOption from './getDropdownOption';

// Firstime sign up requires registration
export const register = async (t: TestController) => {
  const registerChild = {
    birthYear: '2023',
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
    console.log('Register user');

    await t
      .typeText(registerForm.birthDayYearInput, registerChild.birthYear)
      .typeText(registerForm.cityInput, registerChild.city)
      .click(registerForm.verifyInformationCheckbox)
      .click(registerForm.submitButton);

    await t.wait(3500); // 3.5s

    if (await registrationForm.formName.exists) {
      await t
        .typeText(registrationForm.nameInput, registerChild.name)
        .typeText(registrationForm.postalCodeInput, registerChild.postalCode)
        .click(registrationForm.relationshipInput)
        .click(getDropdownOption(registerChild.relationship))
        .click(registrationForm.agreeCheckbox)
        .click(registrationForm.languagesSpokenAtHomeCombobox)
        .click(getDropdownOption(guardian.language))
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
