import { createAction } from '@reduxjs/toolkit';

import { API_AUTHENTICATION_ACTIONS } from '../constants/BackendAuthenticationActionConstants';
import { BackendTokenResponse } from '../types/BackendAuthenticationTypes';

const startFetchingToken = createAction(
  API_AUTHENTICATION_ACTIONS.START_FETCHING_TOKEN
);

const fetchTokenSuccess = createAction<BackendTokenResponse>(
  API_AUTHENTICATION_ACTIONS.FETCH_TOKEN_SUCCESS
);

const fetchTokenError = createAction<Error>(
  API_AUTHENTICATION_ACTIONS.FETCH_TOKEN_ERROR
);

const resetBackendAuthentication = createAction(
  API_AUTHENTICATION_ACTIONS.RESET_BACKEND_AUTHENTICATION
);

export {
  startFetchingToken,
  fetchTokenSuccess,
  fetchTokenError,
  resetBackendAuthentication,
};
