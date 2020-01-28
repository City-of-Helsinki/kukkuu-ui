import { createReducer } from '@reduxjs/toolkit';

import { API_AUTHENTICATION_ACTIONS } from '../constants/BackendAuthenticationActionConstants';
import { BackendAuthenticationData } from '../types/BackendAuthenticationTypes';

export const defaultApiAuthenticationData: BackendAuthenticationData = {
  isFetchingToken: false,
  isAuthenticated: false,
  apiToken: null,
  errors: {},
};

export default createReducer(defaultApiAuthenticationData, {
  [API_AUTHENTICATION_ACTIONS.START_FETCHING_TOKEN]: state =>
    Object.assign({}, state, { isFetchingToken: true }),
  [API_AUTHENTICATION_ACTIONS.FETCH_TOKEN_SUCCESS]: (state, action) =>
    Object.assign({}, state, {
      isFetchingToken: false,
      isAuthenticated: true,
      apiToken: Object.values(action.payload)[0],
    }),
  [API_AUTHENTICATION_ACTIONS.FETCH_TOKEN_ERROR]: (state, action) =>
    Object.assign({}, state, {
      isFetchingToken: false,
      isAuthenticated: false,
      apiToken: null,
      errors: action.payload,
    }),
  [API_AUTHENTICATION_ACTIONS.RESET_BACKEND_AUTHENTICATION]: (state, action) =>
    (state = defaultApiAuthenticationData),
});
