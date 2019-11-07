export interface HomeFormTypes {
  child: {
    birthday: {
      day: string | number;
      month: string | number;
      year: string | number;
    };
    homeCity: string;
  };
  verifyInformation: boolean;
  childBirthday?: string;
}
