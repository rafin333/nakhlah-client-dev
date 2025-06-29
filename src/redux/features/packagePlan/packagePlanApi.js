import { API_URLS } from "@/constants/apiURL";
import { baseApi } from "../../api/baseApi"
import { TagTypes } from "@/constants/tagTypes";
export const packagePlanAPI = baseApi.injectEndpoints({
    endpoints: (build) => ({
      getPackagePlan: build.query({
          query: (args) => ({
              url:`${API_URLS.PACKAGE_PLAN}`,
              method: "GET",
              params: args,
          }),
          providesTags:[TagTypes.PACKAGE_PLAN]
      }),
    }),
    
  })

export const { useGetPackagePlanQuery } = packagePlanAPI;