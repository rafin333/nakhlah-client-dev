import { API_URLS } from "@/constants/apiURL";
import { baseApi } from "../../api/baseApi"
import { TagTypes } from "@/constants/tagTypes";
export const questionContentOptionsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
      getQuestionContentOptions: build.query({
          query: (args) => ({
              url:`${API_URLS.QUESTION_CONTENT_OPTIONS}`,
              method: "GET",
              params: args,
          }),
          providesTags:[TagTypes.QUESTION_CONTENT_OPTIONS]
      }),
      getQuestionContents: build.query({
          query: (args) => ({
              url:`${API_URLS.QUESTION_CONTENTS}`,
              method: "GET",
              params: args,
          }),
          providesTags:[TagTypes.QUESTION_CONTENTS]
      }),
      getQuestionContentById: build.query({
        query: ({ contentId, ...params }) => ({
          url: `${API_URLS.QUESTION_CONTENTS}/${contentId}`, // Assuming API_URLS.QUESTION_CONTENTS represents the base URL for question contents
          method: "GET",
          params,
        }),
        providesTags: (result, error, { contentId }) => contentId ? [{ type: TagTypes.QUESTION_CONTENTS, id: contentId }] : null,
      }),
    }),
    
  })

export const { useGetQuestionContentOptionsQuery, useGetQuestionContentsQuery, useGetQuestionContentByIdQuery } = questionContentOptionsApi;