import { IsNotEmpty, Matches } from 'class-validator';

export class ConfirmMailDto {
  @IsNotEmpty()
  @Matches(/^\d+$/, { message: 'code must be only numbers' })
  code: string;
}
