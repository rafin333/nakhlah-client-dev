import { API_URLS } from "@/constants/apiURL";
import { TagTypes } from "@/constants/tagTypes";
import { baseApi } from "@/redux/api/baseApi";
export const paymentsAPI = baseApi.injectEndpoints({
    endpoints: (build) => ({
      addPaymentsInitiate: build.mutation({
        query: (payload) => ({
            url:`${API_URLS.PAYMENTS}/initiate`,
            method: "POST",
            data: payload
        }),
        invalidatesTags:[TagTypes.PAYMENTS, TagTypes.LEARNING_GAMIFICATION_STOCK, TagTypes.LEARNER_GAMIFICATION]
    }),
    addUnsubscribeInitiate: build.mutation({
      query: (payload) => ({
          url:`${API_URLS.UNSBUSCRIBE}`,
          method: "POST", 
      }),
      invalidatesTags:[TagTypes.UNSUBSCRIBE, TagTypes.LEARNING_GAMIFICATION_STOCK, TagTypes.LEARNER_GAMIFICATION]
  }),
    }),
    
  })

export const { useAddPaymentsInitiateMutation, useAddUnsubscribeInitiateMutation } = paymentsAPI;