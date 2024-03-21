import { Language } from '../../api/generatedTypes/graphql';
import { Children } from '../../child/types/ChildInputTypes';

export interface RegistrationFormValues {
  children: Children;
  guardian: {
    phoneNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    languagesSpokenAtHome: string[];
    hasAcceptedMarketing: boolean;
  };
  preferLanguage: Language;
  agree: boolean;
  verifyInformation: boolean;
}

export interface RegistrationData {
  formValues: RegistrationFormValues;
}
