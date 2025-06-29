import { API_URLS } from "@/constants/apiURL";
import { baseApi } from "../../api/baseApi"
import { TagTypes } from "@/constants/tagTypes";
export const subscriptionPlanAPI = baseApi.injectEndpoints({
    endpoints: (build) => ({
      getSubscriptionPlan: build.query({
          query: (args) => ({
              url:`${API_URLS.SUBSCRIPTIONS_PLAN}`,
              method: "GET",
              params: args,
          }),
          providesTags:[TagTypes.SUBSCRIPTIONS_PLAN]
      }),
    }),
    
  })

export const { useGetSubscriptionPlanQuery } = subscriptionPlanAPI;