// import authReducer from './src/features/authSlice';
// import { configureStore } from '@reduxjs/toolkit';
// import storage from 'redux-persist/lib/storage';
// import persistReducer from 'redux-persist/es/persistReducer';
// import persistStore from 'redux-persist/es/persistStore';

// const persistConfig = {
//   key: 'root',
//   storage,
// };
// const persistedReducer = persistReducer(persistConfig, authReducer);

// export const store = configureStore({
//   reducer: {
//     auth: persistedReducer,
//   },
// });

// export const persistor = persistStore(store);

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './src/features/authSlice';
import serviceRequestReducer from './src/features/serviceRequestSlice';

// Configure the store without persist
export const store = configureStore({
  reducer: {
    auth: authReducer, // Use the authReducer directly without persistence
    serviceRequest: serviceRequestReducer,
  },
});
