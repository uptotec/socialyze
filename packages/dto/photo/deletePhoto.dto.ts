import { IsNotEmpty } from 'class-validator';

export class DeletePhotoDto {
  @IsNotEmpty()
  photos: string[];
}
