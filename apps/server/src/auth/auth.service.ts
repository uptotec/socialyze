import {
  BadRequestException,
  ConflictException,
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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,
    @InjectModel(University.name)
    private universityModel: Model<UniversityDocument>,
    private jwtService: JwtService,
  ) {}

  signJWT(user: User): jwtResponse {
    const payload: jwtPayload = {
      _id: user._id.toString(),
      email: user.email,
      completeProfile: user.completeProfile,
    };

    const accessToken: string = this.jwtService.sign(payload);

    return { accessToken: accessToken };
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

    return this.signJWT(newUser);
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
