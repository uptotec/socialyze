import axios from 'axios';

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
