import { LikeOrDislikeDto, UserResponseDto } from 'dto';
import { Axios } from './axios';

export const getRecommendationsApi = async () => {
  return Axios.get<UserResponseDto[]>('/matching/getRecommendations');
};

export const likeOrDislikeApi = async (data: LikeOrDislikeDto) => {
  return Axios.post<void>('/matching/likeOrDislike', data);
};
