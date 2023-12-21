import { Children } from '../../child/types/ChildInputTypes';

export interface RegistrationFormValues {
  children: Children;
  guardian: {
    phoneNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    languagesSpokenAtHome: string[];
  };
  preferLanguage: string;
  agree: boolean;
  verifyInformation: boolean;
}

export interface RegistrationData {
  formValues: RegistrationFormValues;
}
