import { API_URLS } from "@/constants/apiURL";
import { baseApi } from "../../api/baseApi"
import { TagTypes } from "@/constants/tagTypes";
export const learnerStreaksAPI = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getLearnerStreaks: build.query({
            query: (args) => ({
                url:`${API_URLS.LEARNER_STREAKS}`,
                method: "GET",
                params: args,
            }),
            providesTags:[TagTypes.LEARNER_STREAKS]
        }),
       restoreLearnerStreaks: build.mutation({
          query: (payload) => ({
              url:`${API_URLS.LEARNER_STREAKS}`,
              method: "POST",
              data: payload
          }),
          invalidatesTags:[TagTypes.LEARNER_STREAKS]
      }),
    }),
    
  })

export const { useRestoreLearnerStreaksMutation, useGetLearnerStreaksQuery } = learnerStreaksAPI;