import { configureStore, Store } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { enableES5 } from 'immer';

import rootReducer from './AppReducers';

// Since Immer version 6, support for the fallback implementation has to be explicitly enabled by calling enableES5().
enableES5();
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['registration', 'event'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store: Store = configureStore({
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  reducer: persistedReducer,
});

const persistor = persistStore(store);

export { persistor, store };
