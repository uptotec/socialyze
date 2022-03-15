import {
  BadRequestException,
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { jwtPayload, jwtResponse } from './jwt.interface';
import { User, UserDocument } from '../schema/user/user.schema';
import { SignUpStep1Dto, signUpStep2Dto } from './dto/signUp.dto';
import {
  University,
  UniversityDocument,
} from 'src/schema/university/university.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { Cache } from 'cache-manager';
import { ConfirmMailDto } from './dto/confirmMail.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,
    @InjectModel(University.name)
    private universityModel: Model<UniversityDocument>,
    private jwtService: JwtService,
    private mailerService: MailerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  signJWT(user: User): jwtResponse {
    const payload: jwtPayload = {
      _id: user._id.toString(),
      email: user.email,
    };

    const accessToken: string = this.jwtService.sign(payload);

    return { accessToken: accessToken };
  }

  sendConfirmMail(email: string, code: number) {
    this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to dating - confirm your email',
      html: `<p>welcome, your confirmation code is ${code}<p>`,
    });
  }

  async signUpStep1(credentials: SignUpStep1Dto): Promise<jwtResponse> {
    const { email, password } = credentials;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const emailDomain = email.split('@')[1];

    const university = await this.universityModel.findOne({ emailDomain });

    if (!university)
      throw new UnauthorizedException(
        'Only selected universities emails are allowed to signup',
      );

    const newUser = new this.UserModel({
      email,
      password: hashedPassword,
      university: university,
    });

    try {
      await newUser.save();
    } catch (error: any) {
      switch (error.code) {
        case 11000:
          throw new ConflictException('email already exists');
        default:
          throw new InternalServerErrorException();
      }
    }

    const code = Math.floor(100000 + Math.random() * 900000);
    await this.cacheManager.set(`CODE-${newUser._id}`, code);

    this.sendConfirmMail(newUser.email, code);

    return this.signJWT(newUser);
  }

  async confirmMail(
    { code }: ConfirmMailDto,
    user: UserDocument,
  ): Promise<void> {
    console.log(code);
    const storedCode = await this.cacheManager.get(`CODE-${user._id}`);
    console.log(storedCode);
    if (!storedCode || storedCode !== code)
      throw new UnauthorizedException('invalid Code');

    user.isEmailConfirmed = true;
    await user.save();
  }

  async resendConfirmMail(user: UserDocument): Promise<void> {
    const storedCode = await this.cacheManager.get<number>(`CODE-${user._id}`);
    if (storedCode) {
      this.sendConfirmMail(user.email, storedCode);
    } else {
      const code = Math.floor(100000 + Math.random() * 900000);
      await this.cacheManager.set(`CODE-${user._id}`, code);
      this.sendConfirmMail(user.email, code);
    }
  }

  async signUpStep2(
    profileInfo: signUpStep2Dto,
    profilePic: Express.MulterS3.File,
    user: UserDocument,
  ): Promise<void> {
    if (!profilePic) throw new BadRequestException();

    user.completeProfile = true;
    user.firstName = profileInfo.firstName.toLowerCase();
    user.lastName = profileInfo.lastName.toLowerCase();
    user.bio = profileInfo.bio.replace(/(\r\n|\n|\r)/gm, '');
    user.birthDay = profileInfo.birthDay;
    user.faculty = profileInfo.faculty;
    user.interests = profileInfo.interests;
    user.profilePhoto = {
      name: profilePic.key,
      url: `/profile/photo/${profilePic.key}`,
    };

    await user.save();
  }

  async signIn(credentials: AuthCredentialsDto): Promise<jwtResponse> {
    const { email, password } = credentials;

    const user = await this.UserModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('wrong credentials');

    return this.signJWT(user);
  }
}
