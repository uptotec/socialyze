import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export type ApiResponse<T> =
  | {
      isSuccessful: false;
      status: number;
      data: null;
    }
  | {
      isSuccessful: true;
      status: number;
      data: T;
    };

export const Axios = axios.create({
  baseURL: 'http://192.168.1.11:3000',
  timeout: 1000,
});

const rToken = async () => await SecureStore.getItemAsync('refreshToken');

export const AxiosRefresh = axios.create({
  baseURL: 'http://192.168.1.11:3000',
  timeout: 1000,
});

AxiosRefresh.interceptors.request.use(async function (config) {
  config.headers = { Authorization: `Bearer ${await rToken()}` };
  return config;
});
