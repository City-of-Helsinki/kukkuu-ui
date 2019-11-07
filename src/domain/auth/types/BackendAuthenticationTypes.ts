export type BackendAuthenticationData = {
  isFetchingToken: boolean;
  isAuthenticated: boolean;
  apiToken: string | null;
  errors: object;
};

export type BackendTokenResponse = {
  ['https://api.hel.fi/auth/kukkuu']: string;
};
