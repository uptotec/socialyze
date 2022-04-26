import { Axios } from './axios';
import { FacultyResponseDto, IntrestResponseDto } from 'dto';

export const searchFacultiesApi = async (name: string) => {
  return Axios.get<FacultyResponseDto[]>(`/search/faculty?name=${name}`);
};

export const searchIntrestsApi = async (name: string) => {
  return Axios.get<IntrestResponseDto[]>(`/search/intrest?name=${name}`);
};
