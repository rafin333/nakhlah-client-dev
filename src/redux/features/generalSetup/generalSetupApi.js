import { API_URLS } from "@/constants/apiURL";
import { baseApi } from "../../api/baseApi"
import { TagTypes } from "@/constants/tagTypes";
export const generalSetupApi = baseApi.injectEndpoints({
    endpoints: (build) => ({ 
      getPPolicies: build.query({
          query: (args) => ({
              url:`${API_URLS.PRIVACY_POLICIES}`,
              method: "GET",
              params: args,
          }),
          providesTags:[TagTypes.PRIVACY_POLICIES]
      }),
      getLTips: build.query({
          query: (args) => ({
              url:`${API_URLS.LEARNING_TIPS}`,
              method: "GET",
              params: args,
          }),
          providesTags:[TagTypes.LEARNING_TIPS]
      }),
      getLGuides: build.query({
          query: (args) => ({
              url:`${API_URLS.LEARNING_GUIDES}`,
              method: "GET",
              params: args,
          }),
          providesTags:[TagTypes.LEARNING_GUIDES]
      }),
      getTnConditions: build.query({
        query: (args) => ({
            url:`${API_URLS.TERMS_AND_CONDITIONS}`,
            method: "GET",
            params: args,
        }),
        providesTags:[TagTypes.TERMS_AND_CONDITIONS]
    }),
    }),
    
  })

export const { useGetPPoliciesQuery, useGetLTipsQuery, useGetLGuidesQuery, useGetTnConditionsQuery } = generalSetupApi;