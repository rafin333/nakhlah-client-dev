import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false,
    user: null,
    registeredUser: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            state.user = action.payload;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.user = null;
        },
        regUser: (state, action) => {
            state.registeredUser = action.payload
        }
    },
});

export const { login, logout, regUser } = userSlice.actions;
export default userSlice.reducer;