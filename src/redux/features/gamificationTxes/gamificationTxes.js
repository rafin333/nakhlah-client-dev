import { API_URLS } from "@/constants/apiURL";
import { baseApi } from "../../api/baseApi"
import { TagTypes } from "@/constants/tagTypes";
export const gamificationTxesAPI = baseApi.injectEndpoints({
    endpoints: (build) => ({
      getGamificationTxes: build.query({
          query: (args) => ({
              url:`${API_URLS.GAMIFICATION_TX}`,
              method: "GET",
              params: args,
          }),
          providesTags:[TagTypes.GAMIFICATION_TX]
      }),
      getDailyQuests: build.query({
        query: (args) => ({
            url:`${API_URLS.DAILY_QUEST}`,
            method: "GET",
            params: args,
        }),
        providesTags:[TagTypes.DAILY_QUEST]
    }),
    }),
    
  })

export const { useGetGamificationTxesQuery, useGetDailyQuestsQuery } = gamificationTxesAPI;