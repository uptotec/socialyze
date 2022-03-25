import { IsMongoId } from 'class-validator';

export class ObjectIdQueryDto {
  @IsMongoId()
  id: string;
}
