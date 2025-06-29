import { API_URLS } from "@/constants/apiURL";
import { baseApi } from "../../api/baseApi"
import { TagTypes } from "@/constants/tagTypes";
export const questionDetailsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getQuestionDetails: build.query({
            query: (args) => ({
                url: `${API_URLS.QUESTION_DETAILS}`,
                method: "GET",
                params: args,
            }),
            providesTags: [TagTypes.QUESTION_DETAILS]
        })
    }),

})

export const { useGetQuestionDetailsQuery } = questionDetailsApi;