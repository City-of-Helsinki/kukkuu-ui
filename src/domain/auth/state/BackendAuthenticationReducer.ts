import { createReducer } from '@reduxjs/toolkit';

import { API_AUTHENTICATION_ACTIONS } from '../constants/BackendAuthenticationActionConstants';
import { BackendAuthenticationData } from '../types/BackendAuthenticationTypes';

export const defaultApiAuthenticationData: BackendAuthenticationData = {
  // The idea is making the whole app rendering wait for apiToken check to resolve first
  // On first load, spinner will load no matter what
  // When either token is fetched from redux store, token is fetched successfully, token is failed to fetch
  // Then the app route can render
  isFetchingToken: true,
  apiToken: null,
  errors: {},
};

export default createReducer(defaultApiAuthenticationData, {
  [API_AUTHENTICATION_ACTIONS.START_FETCHING_TOKEN]: (state) =>
    Object.assign({}, state, { isFetchingToken: true }),
  [API_AUTHENTICATION_ACTIONS.FETCH_TOKEN_SUCCESS]: (state, action) =>
    Object.assign({}, state, {
      isFetchingToken: false,
      apiToken: Object.values(action.payload)[0],
    }),
  [API_AUTHENTICATION_ACTIONS.FETCH_TOKEN_ERROR]: (state, action) =>
    Object.assign({}, state, {
      isFetchingToken: false,
      apiToken: null,
      errors: action.payload,
    }),
  [API_AUTHENTICATION_ACTIONS.RESET_BACKEND_AUTHENTICATION]: (state, action) =>
    (state = defaultApiAuthenticationData),
  [API_AUTHENTICATION_ACTIONS.TOKEN_FETCHED]: (state, action) =>
    Object.assign({}, state, { isFetchingToken: false }),
});
