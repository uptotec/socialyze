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
  @Length(100, 280)
  bio: string;

  @IsNotEmpty()
  @IsDateString()
  birthDay: string;

  @IsNotEmpty()
  faculty: string;

  @IsNotEmpty()
  interests: string[];

  @IsNotEmpty()
  photo: any;
}

export class signUpStep2DtoScreen1 {
  @IsNotEmpty()
  @Length(100, 280)
  bio: string;

  @IsNotEmpty()
  @IsDateString()
  birthDay: string;

  @IsNotEmpty()
  faculty: string;

  @IsNotEmpty()
  photo: any;
}

export class SignUpStep1Dto {
  @IsNotEmpty({ message: 'first name can not be empty' })
  @Length(2, 26, { message: 'first name is too long or too short' })
  firstName: string;

  @IsNotEmpty({ message: 'last name can not be empty' })
  @Length(2, 26, { message: 'last name is too long or too short' })
  lastName: string;

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
