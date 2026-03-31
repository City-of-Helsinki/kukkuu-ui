import { Action, ThunkAction } from '@reduxjs/toolkit';

import rootReducer from '../state/AppReducers';

export type StoreState = ReturnType<typeof rootReducer>;

export type StoreThunk = ThunkAction<void, StoreState, null, Action<string>>;
