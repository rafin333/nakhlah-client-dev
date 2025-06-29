import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false,
    journeyData: null,
};

export const journeySlice = createSlice({
    name: 'journeyData',
    initialState,
    reducers: {
        journeyBegin: (state, action) => {
            state.isLoggedIn = true;
            state.journeyData = action.payload;
        },
        journeyEnd: (state) => {
            state.isLoggedIn = false;
            state.journeyData = null;
        },
    },
});

export const { journeyBegin, journeyEnd } = journeySlice.actions;
export default journeySlice.reducer;