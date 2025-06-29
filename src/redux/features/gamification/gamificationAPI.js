import { API_URLS } from "@/constants/apiURL";
import { baseApi } from "../../api/baseApi"
import { TagTypes } from "@/constants/tagTypes";
export const gamificationAPI = baseApi.injectEndpoints({
    endpoints: (build) => ({
    //   addLearnerInfos: build.mutation({
    //       query: (payload) => ({
    //           url:`${API_URLS.LEARNER_INFO}`,
    //           method: "POST",
    //           data: payload
    //       }),
    //       invalidatesTags:[TagTypes.LEARNER_INFO]
    //   }),
      getLearnerGamificationStock: build.query({
          query: (args) => ({
              url:`${API_URLS.LEARNER_GAMIFICATION_STOCK}`,
              method: "GET",
              params: args,
          }),
          providesTags:[TagTypes.LEARNING_GAMIFICATION_STOCK],
          
      }),
    }),
    
  })

export const { useGetLearnerGamificationStockQuery } = gamificationAPI;