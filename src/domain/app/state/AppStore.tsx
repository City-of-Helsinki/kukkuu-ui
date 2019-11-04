import {
  Action,
  configureStore,
  getDefaultMiddleware,
} from 'redux-starter-kit';
import { persistStore, persistReducer } from 'redux-persist';
import { ThunkAction } from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import { loadUser, USER_FOUND } from 'redux-oidc';

import userManager from '../../auth/userManager';
import { fetchApiTokenThunk } from '../../auth/state/ApiReducer';
import rootReducer, { RootState } from './AppReducers';

const isProd = process.env.NODE_ENV === 'production';

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['registration'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  devTools: !isProd,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [USER_FOUND, 'persist/PERSIST'],
    },
  }),
  reducer: persistedReducer,
});

const persistor = persistStore(store);
loadUser(store, userManager).then(async user => {
  if (user) {
    store.dispatch(fetchApiTokenThunk(user.access_token));
  }
});

export { persistor, store };
