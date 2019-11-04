import {
  Action,
  configureStore,
  ConfigureStoreOptions,
  getDefaultMiddleware,
} from 'redux-starter-kit';
import { persistStore, persistReducer } from 'redux-persist';
import { ThunkAction } from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import { loadUser, USER_FOUND } from 'redux-oidc';

import userManager from '../../auth/userManager';
import { fetchApiTokenThunk } from '../../auth/redux';
import rootReducer, { RootState } from './AppReducers';

const isProd = process.env.NODE_ENV === 'production';

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

export function configureAppStore(options: Partial<ConfigureStoreOptions>) {
  const store = configureStore({
    reducer: rootReducer,
    ...options,
  });

  /* eslint-disable @typescript-eslint/no-explicit-any */
  if (!isProd && (module as any).hot) {
    (module as any).hot.accept('./rootReducer', () => {
      store.replaceReducer(rootReducer);
    });
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return store;
}

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['registration'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureAppStore({
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
