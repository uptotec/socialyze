import {
  AuthCredentialsDto,
  JwtResponse,
  SignUpStep1Dto,
  ConfirmMailDto,
  signUpStep2Dto,
} from 'dto';
import FormData from 'form-data';
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

export const signupStep2Api = async (data: signUpStep2Dto) => {
  const payload = new FormData() as any;

  payload.append('bio', data.bio);
  payload.append('faculty', data.faculty);
  payload.append('birthDay', data.birthDay);

  for (const intrest of data.interests) {
    payload.append('interests', intrest);
  }

  let filename = data.photo.uri.split('/').pop();
  let match = /\.(\w+)$/.exec(filename);

  payload.append('photo', {
    uri: data.photo.uri,
    type: match ? `image/${match[1]}` : `image`,
    name: data.photo.uri.split('/').pop(),
  });

  return Axios.post<void>('/auth/signup/step2', payload, {
    headers: {
      'Content-Type': `multipart/form-data; boundary=${payload._boundary}`,
    },
    transformRequest: () => {
      return payload;
    },
  });
};
