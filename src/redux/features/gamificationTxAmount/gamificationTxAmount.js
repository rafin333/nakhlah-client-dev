import { API_URLS } from "@/constants/apiURL";
import { baseApi } from "../../api/baseApi"
import { TagTypes } from "@/constants/tagTypes";
export const gamificationtxAmountAPI = baseApi.injectEndpoints({
    endpoints: (build) => ({
      getGamificationTxAmounts: build.query({
          query: (args) => ({
              url:`${API_URLS.GAMIFICATION_TX_AMOUNTS}`,
              method: "GET",
              params: args,
          }),
          providesTags:[TagTypes.GAMIFICATION_TX_AMOUNTS]
      }),
    }),
    
  })

export const { useGetGamificationTxAmountsQuery } = gamificationtxAmountAPI;