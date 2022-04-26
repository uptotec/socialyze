import { IsMongoId, IsNotEmpty } from 'class-validator';

export class FacultyResponseDto {
  @IsMongoId()
  id: string;

  @IsNotEmpty()
  name: string;
}
