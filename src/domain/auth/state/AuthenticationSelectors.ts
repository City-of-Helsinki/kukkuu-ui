import { StoreState } from '../../app/types/AppTypes';

export const userAccessTokenSelector = (state: StoreState) =>
  state.authentication.tunnistamo.user?.access_token;

export const apiTokenSelector = (state: StoreState) =>
  state.authentication.backend.apiToken;

export const mustRenewApiTokenSelector = (state: StoreState) =>
  state.authentication.backend.mustRenewToken;

export const isLoadingUserSelector = (state: StoreState) =>
  state.authentication.tunnistamo.isLoadingUser ||
  state.authentication.backend.isFetchingToken;

export const isLoggedInSelector = (state: StoreState) =>
  !!state.authentication.tunnistamo.user?.access_token;

export const isAuthenticatedSelector = (state: StoreState) =>
  Boolean(state.authentication.backend.apiToken);

export const isAuthenticatedWithApiTokenSelector = (state: StoreState) =>
  state.authentication.tunnistamo.user?.access_token &&
  !!state.authentication.backend.apiToken;

export const userSelector = (state: StoreState) =>
  state.authentication.tunnistamo.user;
