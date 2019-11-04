import { createSelector } from 'reselect';

import { StoreState } from '../../app/types/stateTypes';

export const idTokenSelector = (state: StoreState) =>
  state.authentication.user && state.authentication.user.id_token;

export const isLoadingUserSelector = (state: StoreState) =>
  state.authentication.isLoadingUser;

export const isAuthenticatedSelector = createSelector(
  idTokenSelector,
  idToken => !!idToken
);
