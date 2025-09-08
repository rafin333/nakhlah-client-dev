import { API_URLS, AUTH_URLS } from "@/constants/apiURL";
import { baseApi } from "../../api/baseApi";
import { TagTypes } from "@/constants/tagTypes";

export const authApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        userLogin: build.mutation({
            query: (loginData) => ({
                url: `${AUTH_URLS.LOGIN}`,
                method: "POST",
                data: loginData,
            }),
            invalidatesTags: [TagTypes.USER],
        }),

        userRegister: build.mutation({
            query: (payload) => ({
                url: `${AUTH_URLS.REGISTER}`,
                method: "POST",
                data: payload,
            }),
            invalidatesTags: [TagTypes.USER],
        }),

        userSocialLogin: build.mutation({
            query: (payload) => ({
                url: `${API_URLS.SOCIAL_LOGIN}`,
                method: "POST",
                data: payload,
            }),
            invalidatesTags: [TagTypes.USER],
        }),

        forgotPassword: build.mutation({
            query: (payload) => ({
                url: `${AUTH_URLS.FORGOT_PASSWORD}`,
                method: "POST",
                data: payload, // usually { email }
            }),
        }),

        // resetPassword: build.mutation({
        //     query: (payload) => ({
        //         url: `${AUTH_URLS.RESET_PASSWORD}`,
        //         method: "POST",
        //         data: payload, // typically { code, password, passwordConfirmation }
        //     }),
        // }),

        resetPassword: build.mutation({
            query: (payload) => ({
                url: `${AUTH_URLS.RESET_PASSWORD}`,
                method: "POST",
                data: payload,
            }),
        }),

        getUserInfo: build.query({
            query: (args) => ({
                url: `${API_URLS.USER}`,
                method: "GET",
                params: args,
            }),
            providesTags: [TagTypes.USER],
        }),

        getUserRegInfo: build.query({
            query: (args) => ({
                url: `${API_URLS.REGISTERED_USER}`,
                method: "GET",
                params: args,
            }),
            providesTags: [TagTypes.USER],
        }),
    }),
});

export const {
    useUserLoginMutation,
    useUserRegisterMutation,
    useUserSocialLoginMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useGetUserInfoQuery,
    useGetUserRegInfoQuery,
} = authApi;
