import { configureStore, getDefaultMiddleware, Store } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { loadUser } from 'redux-oidc';
import { enableES5 } from 'immer';

import rootReducer from './AppReducers';
import userManager from '../../auth/userManager';
// Since Immer version 6, support for the fallback implementation has to be explicitly enabled by calling enableES5().
enableES5();
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['profile', 'registration', 'event'],
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
