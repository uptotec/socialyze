import { IsMongoId, IsNotEmpty } from 'class-validator';

export class IntrestResponseDto {
  @IsMongoId()
  id: string;

  @IsNotEmpty()
  name: string;
}
