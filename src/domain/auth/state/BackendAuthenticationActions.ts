import { createAction } from 'redux-starter-kit';

import { API_AUTHENTICATION_ACTIONS } from '../constants/BackendAuthenticationActionConstants';
import { BackendTokenResponse } from '../types/BackendAuthenticationTypes';

const startFetchingToken = createAction(
  API_AUTHENTICATION_ACTIONS.START_FETCHING_TOKEN
);

const fetchTokenSuccess = createAction<BackendTokenResponse>(
  API_AUTHENTICATION_ACTIONS.FETCH_TOKEN_SUCCESS
);

const fetchTokenError = createAction(
  API_AUTHENTICATION_ACTIONS.FETCH_TOKEN_ERROR
);

export { startFetchingToken, fetchTokenSuccess, fetchTokenError };
