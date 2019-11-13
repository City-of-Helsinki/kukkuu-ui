export interface RegistrationFormValues {
  child: {
    birthdate: string;
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
