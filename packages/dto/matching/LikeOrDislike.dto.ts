import { IsIn, IsNotEmpty } from 'class-validator';

export class LikeOrDislikeDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsIn(['like', 'dislike'])
  type: 'like' | 'dislike';
}
