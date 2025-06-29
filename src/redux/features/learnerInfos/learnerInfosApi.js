import { API_URLS } from "@/constants/apiURL";
import { baseApi } from "../../api/baseApi"
import { TagTypes } from "@/constants/tagTypes";
export const learnerInfoApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
      addLearnerInfos: build.mutation({
          query: (payload) => ({
              url:`${API_URLS.LEARNER_INFO}`,
              method: "POST",
              data: payload
          }),
          invalidatesTags:[TagTypes.LEARNER_INFO]
      }),
      getLearnerInfos: build.query({
          query: (args) => ({
              url:`${API_URLS.LEARNER_INFO}`,
              method: "GET",
              params: args,
          }),
          providesTags:[TagTypes.LEARNER_INFO]
      }),
      getLearningPurpose: build.query({
          query: (args) => ({
              url:`${API_URLS.LEARNING_PURPOSE}`,
              method: "GET",
              params: args,
          }),
          providesTags:[TagTypes.LEARNING_PURPOSE]
      }),
      getLearningGoals: build.query({
          query: (args) => ({
              url:`${API_URLS.LEARNING_GOALS}`,
              method: "GET",
              params: args,
          }),
          providesTags:[TagTypes.LEARNING_GOALS]
      }),
      getSocialTraffic: build.query({
        query: (args) => ({
            url:`${API_URLS.SOCIAL_TRAFFIC}`,
            method: "GET",
            params: args,
        }),
        providesTags:[TagTypes.SOCIAL_TRAFFIC]
    }),
    getLearningJourneyPointer: build.query({
        query: (args) => ({
            url:`${API_URLS.LEARNING_JOURNEY_POINTER}`,
            method: "GET",
            params: args,
        }),
        providesTags:[TagTypes.LEARNING_JOURNEY_POINTER]
    }),
    }),
    
  })

export const { useGetLearnerInfosQuery, useAddLearnerInfosMutation, useGetLearningPurposeQuery, useGetLearningGoalsQuery, useGetSocialTrafficQuery, useGetLearningJourneyPointerQuery } = learnerInfoApi;