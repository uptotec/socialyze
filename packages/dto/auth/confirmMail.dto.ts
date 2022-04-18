import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class ConfirmMailDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  code: string;
}
