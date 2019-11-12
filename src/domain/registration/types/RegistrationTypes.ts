export interface RegistrationFormValues {
  child: {
    birthday: string;
    firstName: string;
    lastName: string;
    homeCity: string;
  };
  verifyInformation: boolean;
  guardian: {
    phoneNumber: string;
    firstName: string;
    lastName: string;
    relationship: string;
    email: string;
  };
}

export interface RegistrationData {
  formValues: RegistrationFormValues;
}

export interface SubmitChildValues {
  birthdate: string;
  firstName: string;
  lastName: string;
  guardianFirstName: string;
  guardianLastName: string;
  email: string;
}
