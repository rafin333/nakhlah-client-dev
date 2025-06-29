import { API_URLS } from "@/constants/apiURL";
import { baseApi } from "../../api/baseApi"
import { TagTypes } from "@/constants/tagTypes";
export const learningJourneyApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
      getLearningJourneyUnits: build.query({
          query: (args) => ({
              url:`${API_URLS.LEARNING_JOURNEY_UNITS}`,
              method: "GET",
              params: args,
          }),
          providesTags:[TagTypes.LEARNING_JOURNEY_UNITS]
      }),
      getLearningJourneyLevels: build.query({
          query: (args) => ({
              url:`${API_URLS.LEARNING_JOURNEY_LEVELS}`,
              method: "GET",
              params: args,
          }),
          providesTags:[TagTypes.LEARNING_JOURNEY_LEVELS]
      }),
      getLearningJourneyLessons: build.query({
          query: (args) => ({
              url:`${API_URLS.LEARNING_JOURNEY_LESSONS}`,
              method: "GET",
              params: args,
          }),
          providesTags:[TagTypes.LEARNING_JOURNEY_LESSONS]
      }),
      addLearnerJourney: build.mutation({
        query: (payload) => ({
            url:`${API_URLS.LEARNER_JOURNEY}`,
            method: "POST",
            data: payload
        }),
        invalidatesTags:[TagTypes.LEARNER_JOURNEY, TagTypes.LEARNER_PROGRESS, TagTypes.LEARNING_GAMIFICATION_STOCK]
    }),
    }),
    
  })

export const { useGetLearningJourneyUnitsQuery, useGetLearningJourneyLevelsQuery, useGetLearningJourneyLessonsQuery, useAddLearnerJourneyMutation } = learningJourneyApi;