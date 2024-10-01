export interface HomeFormValues {
  child?: {
    birthyear: number;
    homeCity: string;
  };
  verifyInformation: boolean;
}

export interface HomeFormPayload {
  verifyInformation: boolean;
  child: {
    birthyear: number;
    // TODO: Give me proper type
    homeCity: string;
  };
}
