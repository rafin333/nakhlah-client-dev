import { API_URLS, AUTH_URLS } from "@/constants/apiURL";
import { baseApi } from "../../api/baseApi"
import { TagTypes } from "@/constants/tagTypes";
export const authApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
      userLogin: build.mutation({
          query: (loginData) => ({
              url:`${AUTH_URLS.LOGIN}`,
              method: "POST",
              data: loginData
          }),
          invalidatesTags:[TagTypes.USER]
      }),
      userRegister: build.mutation({
          query: (payload) => ({
              url:`${AUTH_URLS.REGISTER}`,
              method: "POST",
              data: payload
          }),
          invalidatesTags:[TagTypes.USER]
      }),
      userSocialLogin: build.mutation({
        query: (payload) => ({
            url:`${API_URLS.SOCIAL_LOGIN}`,
            method: "POST",
            data: payload
        }),
        invalidatesTags:[TagTypes.USER]
    }),
      getUserInfo: build.query({
          query: (args) => ({
              url:`${API_URLS.USER}`,
              method: "GET",
              params: args,
          }),
          providesTags:[TagTypes.USER]
      }),
      getUserRegInfo: build.query({
        query: (args) => ({
            url:`${API_URLS.REGISTERED_USER}`,
            method: "GET",
            params: args,
        }),
        providesTags:[TagTypes.USER]
    }),
    }),
    
  })

export const { useUserLoginMutation, useGetUserInfoQuery, useUserRegisterMutation,useUserSocialLoginMutation, useGetUserRegInfoQuery } = authApi;