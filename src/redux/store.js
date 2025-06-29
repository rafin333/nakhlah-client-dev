import { configureStore } from "@reduxjs/toolkit";
import { reducer } from "./rootReducer";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "./api/baseApi";
import userReducer from "./state/userSlice";
import gamificationReducer from "./state/gemificationSlice";
import journeyReducer from "./state/journeySlice";
import subscriptionReducer from "./state/subscriptionSlice";
import streakReducer from "./state/streakSlice";

export const store = configureStore({
  reducer: {
    userStore: userReducer,
    gamificationStore: gamificationReducer,
    journeyStore: journeyReducer,
    subscriptionStore: subscriptionReducer,
    streakStore: streakReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
setupListeners(store.dispatch);
