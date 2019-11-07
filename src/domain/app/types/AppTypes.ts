import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux-starter-kit';

import rootReducer from '../state/AppReducers';

export type StoreState = ReturnType<typeof rootReducer>;

export type StoreThunk = ThunkAction<void, StoreState, null, Action<string>>;
