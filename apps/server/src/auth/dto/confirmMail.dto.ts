import { IsInt, IsNotEmpty, IsPositive, Length } from 'class-validator';

export class ConfirmMailDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  code: string;
}
