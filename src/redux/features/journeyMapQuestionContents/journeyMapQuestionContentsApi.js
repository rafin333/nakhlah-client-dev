import { API_URLS } from "@/constants/apiURL";
import { baseApi } from "../../api/baseApi"
import { TagTypes } from "@/constants/tagTypes";
export const journeyMapQuestionContentsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
      getJourneyMapQuestionContents: build.query({
          query: (args) => ({
              url:`${API_URLS.JOURNEY_MAP_QUESTION_CONTENTS}`,
              method: "GET",
              params: args,
          }),
          providesTags:[TagTypes.JOURNEY_MAP_QUESTION_CONTENTS]
      })
    }),
    
  })

export const { useGetJourneyMapQuestionContentsQuery } = journeyMapQuestionContentsApi;