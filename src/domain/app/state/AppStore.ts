import { configureStore, getDefaultMiddleware, Store } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { loadUser } from 'redux-oidc';

import rootReducer from './AppReducers';
import userManager from '../../auth/userManager';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['profile', 'registration'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store: Store = configureStore({
  devTools: true,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
  reducer: persistedReducer,
});

loadUser(store, userManager);

const persistor = persistStore(store);

export { persistor, store };
