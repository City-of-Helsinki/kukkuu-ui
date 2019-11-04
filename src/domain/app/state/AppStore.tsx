import { Action,
  configureStore,
  ConfigureStoreOptions,
  getDefaultMiddleware
} from 'redux-starter-kit';
import { persistStore, persistReducer } from 'redux-persist';
import { ThunkAction } from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import { loadUser, USER_FOUND } from 'redux-oidc';

import userManager from '../../auth/userManager';
import rootReducer, { RootState } from './AppReducers';

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['registration'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store: Store = configureStore({
  devTools: true,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [USER_FOUND, 'persist/PERSIST'],
    },
  }),
  reducer: persistedReducer,
});

const persistor = persistStore(store);
loadUser(store, userManager);

export { persistor, store };
