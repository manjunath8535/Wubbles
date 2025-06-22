import { configureStore } from '@reduxjs/toolkit';
import musicReducer from './slices/musicSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice'; 

// Storing the track details.
export const store = configureStore({
    reducer: {
        music: musicReducer,
        ui: uiReducer,
        auth: authReducer,
    },
});