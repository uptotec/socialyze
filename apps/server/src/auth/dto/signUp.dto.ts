import {
  IsNotEmpty,
  IsEmail,
  Matches,
  MinLength,
  MaxLength,
  Length,
  IsDateString,
} from 'class-validator';

export class signUpStep2Dto {
  @IsNotEmpty()
  @Length(2, 26)
  firstName: string;

  @IsNotEmpty()
  @Length(2, 26)
  lastName: string;

  @IsNotEmpty()
  @Length(100, 280)
  bio: string;

  @IsNotEmpty()
  @IsDateString()
  birthDay: Date;

  @IsNotEmpty()
  faculty: string;

  @IsNotEmpty()
  interests: string[];
}

export class SignUpStep1Dto {
  @IsNotEmpty()
  university: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Weak Passowrd',
  })
  password: string;
}
