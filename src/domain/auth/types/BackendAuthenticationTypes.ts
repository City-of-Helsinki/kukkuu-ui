export type BackendAuthenticationData = {
  isFetchingToken: boolean;
  apiToken: string | null;
  hasProfile: boolean;
  mustRenewToken: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  errors: object;
};

export type BackendTokenResponse = {
  ['https://api.hel.fi/auth/kukkuu']: string;
};
