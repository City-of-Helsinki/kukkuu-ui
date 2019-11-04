import { createSelector } from 'reselect';

import { StoreState } from '../../app/types/stateTypes';

export const idTokenSelector = (state: StoreState) =>
  state.oidc.user && !!state.oidc.user.id_token;

export const isLoadingUserSelector = (state: StoreState) =>
  state.oidc.isLoadingUser;

export const isAuthenticatedSelector = createSelector(
  idTokenSelector,
  idToken => !!idToken
);
