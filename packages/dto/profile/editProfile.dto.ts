import { IsDateString, IsOptional, Length } from 'class-validator';

export class EditProfileDto {
  @IsOptional()
  @Length(2, 26)
  firstName?: string;

  @IsOptional()
  @Length(2, 26)
  lastName?: string;

  @IsOptional()
  @Length(100, 280)
  bio?: string;

  @IsOptional()
  @IsDateString()
  birthDay?: Date;

  @IsOptional()
  faculty?: string;

  @IsOptional()
  interests?: string[];
}
