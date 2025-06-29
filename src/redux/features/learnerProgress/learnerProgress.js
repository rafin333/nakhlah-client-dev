import { API_URLS } from "@/constants/apiURL";
import { baseApi } from "../../api/baseApi"
import { TagTypes } from "@/constants/tagTypes";
export const learnerProgressAPI = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getLearnerProgress: build.query({
            query: (args) => ({
                url:`${API_URLS.LEARNER_PROGRESS}`,
                method: "GET",
                params: args,
            }),
            providesTags:[TagTypes.LEARNER_PROGRESS]
        }),
       updateLearnerProgress: build.mutation({
          query: ({ id, ...payload }) => ({
              url:`${API_URLS.LEARNER_PROGRESS}/${id}`,
              method: "PUT",
              data: payload
          }),
          invalidatesTags:[TagTypes.LEARNING_GAMIFICATION_STOCK]
      }),
    }),
    
  })

export const { useGetLearnerProgressQuery, useUpdateLearnerProgressMutation } = learnerProgressAPI;