import { createReducer } from '@reduxjs/toolkit';
import { USER_FOUND } from 'redux-oidc';

import apiTokenService from '../../auth/apiTokenService';
import { API_AUTHENTICATION_ACTIONS } from '../constants/BackendAuthenticationActionConstants';
import { BackendAuthenticationData } from '../types/BackendAuthenticationTypes';

export const defaultApiAuthenticationData: BackendAuthenticationData = {
  isFetchingToken: false,
  mustRenewToken: true,
  hasProfile: false,
  // Find apiToken from service that persists it over page reloads
  apiToken: apiTokenService.apiToken,
  errors: {},
};

export default createReducer(defaultApiAuthenticationData, {
  // Renew backend API token after silent renew
  [USER_FOUND]: (state, action) => {
    state.mustRenewToken = true;
  },
  [API_AUTHENTICATION_ACTIONS.START_FETCHING_TOKEN]: (state) =>
    Object.assign({}, state, { isFetchingToken: true }),
  [API_AUTHENTICATION_ACTIONS.FETCH_TOKEN_SUCCESS]: (state, action) =>
    Object.assign({}, state, {
      isFetchingToken: false,
      mustRenewToken: false,
      hasProfile: true,
      apiToken: Object.values(action.payload)[0],
    }),
  [API_AUTHENTICATION_ACTIONS.FETCH_TOKEN_ERROR]: (state, action) =>
    Object.assign({}, state, {
      isFetchingToken: false,
      apiToken: null,
      hasProfile: false,
      errors: action.payload,
    }),
  [API_AUTHENTICATION_ACTIONS.RESET_BACKEND_AUTHENTICATION]: (state, action) =>
    (state = defaultApiAuthenticationData),
  [API_AUTHENTICATION_ACTIONS.TOKEN_FETCHED]: (state, action) =>
    Object.assign({}, state, { isFetchingToken: false }),
});
