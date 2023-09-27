import {
  registerForm,
  registrationForm,
  registrationDone,
} from '../pages/register';
import getDropdownOption from './getDropdownOption';

// Firstime sign up requires registration
export const register = async (t: TestController) => {
  const registerChild = {
    birthDate: {
      day: '01',
      month: '01',
      year: '2023',
    },
    city: 'Helsinki',
    postalCode: '00000',
    firstName: 'Hertta',
    lastName: 'Citron',
    relationship: 'Vanhempi',
  };
  const guardian = {
    phoneNumber: '0000000000',
    language: 'suomi',
  };

  if (await registerForm.section.exists) {
    console.log('Register user');

    await t
      .typeText(registerForm.birthDayDayInput, registerChild.birthDate.day)
      .typeText(registerForm.birthDayMonthInput, registerChild.birthDate.month)
      .typeText(registerForm.birthDayYearInput, registerChild.birthDate.year)
      .typeText(registerForm.cityInput, registerChild.city)
      .click(registerForm.verifyInformationCheckbox)
      .click(registerForm.submitButton);

    await t.wait(3500); // 3.5s

    if (await registrationForm.formName.exists) {
      await t
        .typeText(registrationForm.firstNameInput, registerChild.firstName)
        .typeText(registrationForm.lastNameInput, registerChild.lastName)
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
