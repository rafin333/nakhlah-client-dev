import { API_URLS } from "@/constants/apiURL";
import { baseApi } from "../../api/baseApi"
import { TagTypes } from "@/constants/tagTypes";
export const contentDetailsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getContentDetails: build.query({
            query: (args) => ({
                url: `${API_URLS.CONTENT_DETAILS}`,
                method: "GET",
                params: args,
            }),
            providesTags: [TagTypes.CONTENT_DETAILS]
        }),
        getContentDetailsByLanguages: build.query({
            query: (args) => ({
                url: `${API_URLS.CONTENT_DETAILS_BY_LANGUAGES}`,
                method: "GET",
                params: args,
            }),
            providesTags: [TagTypes.CONTENT_DETAILS_BY_LANGUAGES]
        }),
        getContentDetailsByClauses: build.query({
            query: (args) => ({
                url: `${API_URLS.CONTENT_BY_CLAUSES}`,
                method: "GET",
                params: args,
            }),
            providesTags: [TagTypes.CONTENT_BY_CLAUSES]
        }),
        getContentDetailsBySyllables: build.query({
            query: (args) => ({
                url: `${API_URLS.CONTENT_BY_SYLLABLES}`,
                method: "GET",
                params: args,
            }),
            providesTags: [TagTypes.CONTENT_BY_SYLLABLES]
        })
    }),

})

export const { useGetContentDetailsQuery, useGetContentDetailsByLanguagesQuery, useGetContentDetailsByClausesQuery, useGetContentDetailsBySyllablesQuery } = contentDetailsApi;