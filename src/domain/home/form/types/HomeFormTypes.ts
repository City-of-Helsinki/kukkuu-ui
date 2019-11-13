export interface HomeFormValues {
  child: {
    birthdate: {
      day: string | number;
      month: string | number;
      year: string | number;
    };
    homeCity: string;
  };
  verifyInformation: boolean;
  childBirthdate?: string;
}
