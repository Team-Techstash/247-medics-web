import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import appointmentFormReducer from './slices/appointmentFormSlice';
import referenceReducer from './slices/referenceSlice';
import locationReducer from './slices/locationSlice';

const rootReducer = combineReducers({
  appointmentForm: appointmentFormReducer,
  references: referenceReducer,
  location: locationReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['appointmentForm', 'location'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
