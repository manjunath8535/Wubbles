import { createSlice } from '@reduxjs/toolkit';

// Adding dark & light mode to the website.
const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const initialState = {
    theme: getInitialTheme(),
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', state.theme);
        },
    },
});

export const { toggleTheme } = uiSlice.actions;
export const selectTheme = (state) => state.ui.theme;
export default uiSlice.reducer;