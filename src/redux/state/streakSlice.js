import { createSlice } from '@reduxjs/toolkit';

const initialState = { 
    streakData: null,
};

export const streakSlice = createSlice({
    name: 'subscription',
    initialState,
    reducers: {
        streaks: (state, action) => { 
            state.streakData = action.payload;
        }
    },
});

export const { streaks } = streakSlice.actions;
export default streakSlice.reducer;