import {
  IsNotEmpty,
  IsEmail,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';

export class AuthCredentialsDto {
  constructor(values: AuthCredentialsDto) {
    Object.assign(this, values);
  }
  @IsEmail(undefined, { message: 'email must be valid' })
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Weak Passowrd',
  })
  password: string;
}
