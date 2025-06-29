import { getUserInfo } from '@/services/auth.service';
import axios from 'axios';

const instance = axios.create();
instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers.post["Accept"] = "application/json";
instance.defaults.timeout = 60000;


// Add a request interceptor
instance.interceptors.request.use(function (config) {
    const accessToken = getUserInfo();
    if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    const responseObject = {
        data: response?.data?.data || response?.data || null,
        meta: response?.data?.meta
    }
    return responseObject;
  }, function (error) {
    return Promise.reject(error);
  });

export {instance};