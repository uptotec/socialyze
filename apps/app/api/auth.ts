import {
  AuthCredentialsDto,
  JwtResponse,
  SignUpStep1Dto,
  ConfirmMailDto,
} from 'dto';
import { Axios } from './axios';

export const loginApi = async (credentials: AuthCredentialsDto) => {
  return Axios.post<JwtResponse>('/auth/signin', credentials);
};

export const signupStep1Api = async (data: SignUpStep1Dto) => {
  return Axios.post<JwtResponse>('/auth/signup/step1', data);
};

export const confirmMailApi = async (code: ConfirmMailDto) => {
  return Axios.post<void>('/auth/confirmMail', code);
};
