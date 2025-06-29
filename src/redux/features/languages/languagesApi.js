import { API_URLS } from "@/constants/apiURL";
import { baseApi } from "../../api/baseApi"
import { TagTypes } from "@/constants/tagTypes";
export const languagesApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
      getLanguages: build.query({
          query: (args) => ({
              url:`${API_URLS.LANGUAGES}`,
              method: "GET",
              params: args,
          }),
          providesTags:[TagTypes.LANGUAGES]
      }),
      getCountry: build.query({
        query: (args) => ({
            url:`${API_URLS.COUNTRY}`,
            method: "GET",
            params: args,
        }),
        providesTags:[TagTypes.COUNTRY]
    }),
    }),
    
  })

export const { useGetLanguagesQuery, useGetCountryQuery } = languagesApi;