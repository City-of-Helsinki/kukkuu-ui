import { reducer as oidcReducer } from 'redux-oidc';
import { combineReducers } from 'redux';

import backendAuthenticationReducer from './BackendAuthenticationReducer';

export default combineReducers({
  tunnistamo: oidcReducer,
  backend: backendAuthenticationReducer,
});
