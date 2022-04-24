import { AuthCredentialsDto, JwtResponse } from 'dto';
import { ApiResponse, Axios } from './axios';

export const loginApi = async (
  credentials: AuthCredentialsDto,
): Promise<ApiResponse<JwtResponse>> => {
  try {
    const res = await Axios.post<JwtResponse>('/auth/signin', credentials);
    return { isSuccessful: true, data: res.data, status: res.status };
  } catch (err: any) {
    return { isSuccessful: false, data: null, status: err.response.status };
  }
};
