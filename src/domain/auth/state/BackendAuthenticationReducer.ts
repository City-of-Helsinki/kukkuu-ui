import { createAction, createReducer } from '@reduxjs/toolkit';
import { USER_FOUND } from 'redux-oidc';

import apiTokenService from '../../auth/apiTokenService';
import { BackendAuthenticationData } from '../types/BackendAuthenticationTypes';
import {
  fetchTokenError,
  fetchTokenSuccess,
  resetBackendAuthentication,
  startFetchingToken,
  tokenFetched,
} from './BackendAuthenticationActions';

export const defaultApiAuthenticationData: BackendAuthenticationData = {
  isFetchingToken: false,
  mustRenewToken: true,
  hasProfile: false,
  // Find apiToken from service that persists it over page reloads
  apiToken: apiTokenService.apiToken,
  errors: {},
};

const userFound = createAction(USER_FOUND);

const reducer = createReducer(defaultApiAuthenticationData, (builder) => {
  builder
    .addCase(userFound, (state) => ({ ...state, mustRenewToken: true }))
    .addCase(startFetchingToken, (state) => ({
      ...state,
      isFetchingToken: true,
    }))
    .addCase(fetchTokenSuccess, (state, action) => ({
      ...state,
      isFetchingToken: false,
      mustRenewToken: false,
      hasProfile: true,
      apiToken: Object.values(action.payload)[0],
    }))
    .addCase(fetchTokenError, (state, action) => ({
      ...state,
      isFetchingToken: false,
      apiToken: null,
      hasProfile: false,
      errors: action.payload,
    }))
    .addCase(resetBackendAuthentication, () => ({
      ...defaultApiAuthenticationData,
    }))
    .addCase(tokenFetched, (state) => ({ ...state, isFetchingToken: false }));
});

export default reducer;
