import { API_URLS } from "@/constants/apiURL";
import { baseApi } from "../../api/baseApi"
import { TagTypes } from "@/constants/tagTypes";
export const examAPI = baseApi.injectEndpoints({
    endpoints: (build) => ({
      addExams: build.mutation({
          query: (payload) => ({
              url:`${API_URLS.EXAMS}`,
              method: "POST",
              data: payload
          }),
          invalidatesTags:[TagTypes.EXAMS, TagTypes.LEARNING_GAMIFICATION_STOCK]
      }),
      getExams: build.query({
          query: (args) => ({
              url:`${API_URLS.EXAMS}`,
              method: "GET",
              params: args,
          }),
          providesTags:[TagTypes.EXAMS],
          
      }),
    }),
    
  })

export const { useAddExamsMutation, useGetExamsQuery } = examAPI;