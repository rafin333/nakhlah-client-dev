import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  palmData: null,
  datesData: null,
  injazData: null,
  leaderboardData: null,
  questData: null,
};

export const gamificationSlice = createSlice({
  name: "gamification",
  initialState,
  reducers: {
    loading: (state, action) => {
      state.isLoading = action.payload;
    },
    palm: (state, action) => {
      state.palmData = action.payload;
    },
    dates: (state, action) => {
      state.datesData = action.payload;
    },
    injaz: (state, action) => {
      state.injazData = action.payload;
    },
    leaderboard: (state, action) => {
      state.leaderboardData = action.payload;
    },
    dailyQuests: (state, action) => {
      state.questData = action.payload;
    }
  },
});

export const { loading, palm, dates, injaz, leaderboard, dailyQuests } = gamificationSlice.actions;
export default gamificationSlice.reducer;
