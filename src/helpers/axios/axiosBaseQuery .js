import { getBaseURL } from '../config/envConfig'
import { instance as axiosInstance } from './axiosInstance';

export const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: getBaseURL() }) =>
  async ({ url, method, data, params, contentType }) => {
    // console.log("axiosBaseQuery ==> ",baseUrl + url);
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: {
            'Content-Type' : contentType || "application/json"
        },
      })
      return { data: result.data }
    } catch (axiosError) {
      const err = axiosError
      return {
        error: {    
          status: err.response?.status,
          data: err.response?.data || err.message,
          errorMessage: err.response?.data?.error?.message,
        },
      }
    }
  }