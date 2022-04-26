import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UniversityResponseDto {
  @IsMongoId()
  id: string;

  @IsNotEmpty()
  name: string;
}
