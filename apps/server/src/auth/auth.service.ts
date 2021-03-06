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

import { AuthCredentialsDto } from 'dto';
import { JwtPayload, JwtResponse } from 'dto';
import { User, UserDocument } from '../schema/user/user.schema';
import { SignUpStep1Dto, signUpStep2Dto } from 'dto';
import {
  University,
  UniversityDocument,
} from 'src/schema/university/university.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { Cache } from 'cache-manager';
import { ConfirmMailDto } from 'dto';
import { ConfigService } from '@nestjs/config';

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
    private configService: ConfigService,
  ) {}

  async signJWT(user: User): Promise<JwtResponse> {
    const payload: JwtPayload = {
      _id: user._id.toString(),
      email: user.email,
    };

    console.log('refreshed');

    const accessToken: string = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: '30m',
    });

    const refreshToken: string = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '90 days',
    });

    const rToken = this.jwtService.decode(refreshToken) as JwtPayload;
    const aToken = this.jwtService.decode(accessToken) as JwtPayload;

    return {
      isEmailConfirmed: user.isEmailConfirmed,
      iscompleteProfile: user.completeProfile,
      accessToken,
      refreshToken,
      expAccessToken: aToken.exp,
      expRefreshToken: rToken.exp,
    };
  }

  sendConfirmMail(user: User, code: number) {
    this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to dating - confirm your email',
      template: 'confirmEmail',
      context: {
        code: code,
        fullName: user.fullName,
      },
    });
  }

  sendForgetPassword(user: User, code: number) {
    this.mailerService.sendMail({
      to: user.email,
      subject: 'dating - reset your password',
      template: 'forgetPassword',
      context: {
        code: code,
        fullName: user.fullName,
      },
    });
  }

  async RefreshAccessToken(user: UserDocument) {
    const jwtPayload = await this.signJWT(user);

    const salt = await bcrypt.genSalt();
    const jwtSign = jwtPayload.refreshToken.split('.')[2];
    const hashedToken = await bcrypt.hash(jwtSign, salt);

    user.refreshToken = hashedToken;
    await user.save();

    return jwtPayload;
  }

  async signUpStep1(credentials: SignUpStep1Dto): Promise<JwtResponse> {
    const { email, password, firstName, lastName } = credentials;

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
      university,
      firstName: firstName.toLowerCase().replace(/\s/g, ''),
      lastName: lastName.toLowerCase().replace(/\s/g, ''),
    });

    const jwtPayload = await this.signJWT(newUser);

    const salt2 = await bcrypt.genSalt();
    const jwtSign = jwtPayload.refreshToken.split('.')[2];
    const hashedToken = await bcrypt.hash(jwtSign, salt2);

    newUser.refreshToken = hashedToken;

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
    await this.cacheManager.set(`CONFIRM-${newUser._id}`, code);

    this.sendConfirmMail(newUser, code);

    return jwtPayload;
  }

  async confirmMail(
    { code }: ConfirmMailDto,
    user: UserDocument,
  ): Promise<void> {
    const storedCode = await this.cacheManager.get(`CONFIRM-${user._id}`);
    if (!storedCode || storedCode.toString() !== code)
      throw new UnauthorizedException('invalid Code');

    user.isEmailConfirmed = true;
    await user.save();
  }

  async resendConfirmMail(user: UserDocument): Promise<void> {
    const storedCode = await this.cacheManager.get<number>(
      `CONFIRM-${user._id}`,
    );
    if (storedCode) {
      this.sendConfirmMail(user, storedCode);
    } else {
      const code = Math.floor(100000 + Math.random() * 900000);
      await this.cacheManager.set(`CONFIRM-${user._id}`, code);
      this.sendConfirmMail(user, code);
    }
  }

  async signUpStep2(
    profileInfo: signUpStep2Dto,
    profilePic: Express.MulterS3.File,
    user: UserDocument,
  ): Promise<void> {
    if (!profilePic) throw new BadRequestException();

    user.completeProfile = true;
    user.bio = profileInfo.bio.replace(/(\r\n|\n|\r)/gm, '');
    user.birthDay = profileInfo.birthDay;
    user.faculty = profileInfo.faculty;
    user.interests = profileInfo.interests;
    user.profilePhoto = {
      name: profilePic.key,
      url: `/photo/${profilePic.key}`,
    };

    await user.save();
  }

  async signIn(credentials: AuthCredentialsDto): Promise<JwtResponse> {
    const { email, password } = credentials;

    const user = await this.UserModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('wrong credentials');

    const jwtPayload = await this.signJWT(user);

    const salt = await bcrypt.genSalt();
    const jwtSign = jwtPayload.refreshToken.split('.')[2];
    const hashedToken = await bcrypt.hash(jwtSign, salt);

    user.refreshToken = hashedToken;
    await user.save();

    return jwtPayload;
  }
}
