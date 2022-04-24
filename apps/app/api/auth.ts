import { AuthCredentialsDto, JwtResponse } from 'dto';
import { Axios, AxiosRefresh } from './axios';

export const loginApi = async (credentials: AuthCredentialsDto) => {
  return Axios.post<JwtResponse>('/auth/signin', credentials);
};

export const refreshToken = async () => {
  try {
    return AxiosRefresh.get<JwtResponse>('/auth/refreash');
  } catch (err: any) {
    return err;
  }
};
