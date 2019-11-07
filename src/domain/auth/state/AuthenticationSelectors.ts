import { StoreState } from '../../app/types/AppTypes';

export const idTokenSelector = (state: StoreState) =>
  state.authentication.backend.apiToken;

export const isLoadingUserSelector = (state: StoreState) =>
  state.authentication.tunnistamo.isLoadingUser &&
  state.authentication.backend.isFetchingToken;

export const isAuthenticatedSelector = (state: StoreState) =>
  state.authentication.backend.isAuthenticated;
