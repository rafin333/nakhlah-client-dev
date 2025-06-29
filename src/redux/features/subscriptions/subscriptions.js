import { API_URLS } from "@/constants/apiURL";
import { baseApi } from "../../api/baseApi"
import { TagTypes } from "@/constants/tagTypes";
export const subscriptionsAPI = baseApi.injectEndpoints({
    endpoints: (build) => ({
      getSubscriptions: build.query({
          query: (args) => ({
              url:`${API_URLS.SUBSCRIPTIONS}`,
              method: "GET",
              params: args,
          }),
          providesTags:[TagTypes.SUBSCRIPTIONS]
      }),
    }),
    
  })

export const { useGetSubscriptionsQuery } = subscriptionsAPI;