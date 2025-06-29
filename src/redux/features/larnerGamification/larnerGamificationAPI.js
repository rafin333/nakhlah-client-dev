import { API_URLS } from "@/constants/apiURL";
import { baseApi } from "../../api/baseApi"
import { TagTypes } from "@/constants/tagTypes";
export const learnerGamificationAPI = baseApi.injectEndpoints({
    endpoints: (build) => ({
        addlearnerGamification: build.mutation({
            query: (payload) => ({
                url: `${API_URLS.LEARNER_GAMIFICATION}`,
                method: "POST",
                data: payload
            }),
            invalidatesTags: [TagTypes.LEARNING_GAMIFICATION_STOCK, TagTypes.LEARNER_GAMIFICATION]
        }),
        getLearnerGamifications: build.query({
            query: (args) => ({
                url: `${API_URLS.LEARNER_GAMIFICATION}`,
                method: "GET",
                params: args,
            }),
            providesTags: [TagTypes.LEARNER_GAMIFICATION]
        }),
        getLearnerGamificationsTXAmount: build.query({
            query: (args) => ({
                url: `${API_URLS.LEARNER_GAMIFICATION}/get-tx-amount`,
                method: "GET",
                params: args,
            }),
            providesTags: [TagTypes.LEARNER_GAMIFICATION]
        }),
        getTopTenUser: build.query({
            query: (args) => ({
                url: `${API_URLS.TOP_TEN_LEADERBOARD}`,
                method: "GET",
                params: args,
            }),
            providesTags: [TagTypes.LEARNER_GAMIFICATION]
        }),
        getUserLeaderboardPosition: build.query({
            query: (args) => ({
                url: `${API_URLS.USER_LEADERBOARD_POSITION}`,
                method: "GET",
                params: args,
            }),
            providesTags: [TagTypes.LEARNER_GAMIFICATION]
        }),
    }),

})

export const { useGetUserLeaderboardPositionQuery, useGetTopTenUserQuery, useAddlearnerGamificationMutation, useGetLearnerGamificationsQuery, useGetLearnerGamificationsTXAmountQuery } = learnerGamificationAPI;