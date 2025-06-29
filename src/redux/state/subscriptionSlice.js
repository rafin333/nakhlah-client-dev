import { createSlice } from '@reduxjs/toolkit';

const initialState = { 
    planData: null,
};

export const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState,
    reducers: {
        subPlan: (state, action) => { 
            state.planData = action.payload;
        }
    },
});

export const { subPlan } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;