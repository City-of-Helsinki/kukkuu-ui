import { createSlice } from 'redux-starter-kit';

import { AppThunk } from '../../../domain/app/state/AppStore';
import { RootState } from '../../../domain/app/state/AppReducers';
import fetchApiToken from '../fetchApiToken';

interface ApiAuthenticationState {
  apiTokens: { [key: string]: string };
  loadingApiToken: boolean;
}

const initialState: ApiAuthenticationState = {
  apiTokens: {},
  loadingApiToken: false,
};

const authSlice = createSlice({
  initialState: initialState,
  name: 'ApiAuthentication',
  reducers: {
    receiveApiToken: (state, action) => {
      state.apiTokens = action.payload;
    },
  },
});

export const { receiveApiToken } = authSlice.actions;
export default authSlice.reducer;

export const fetchApiTokenThunk = (
  accessToken: string
): AppThunk => async dispatch => {
  const token = await fetchApiToken(accessToken);
  return dispatch(receiveApiToken(token));
};

export const profileApiTokenSelector = (state: RootState) =>
  state.authentication.apiAuthentication.apiTokens[
    process.env.REACT_APP_PROFILE_AUDIENCE as string
  ];
