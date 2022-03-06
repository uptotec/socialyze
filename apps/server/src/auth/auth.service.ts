import {
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
import { SignUpStep1Dto, SignUpStep2Dto } from './dto/signUp.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,
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

    const newUser = new this.UserModel({
      email,
      password: hashedPassword,
      university: credentials.university,
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

  async signUpStep2(profileInfo: SignUpStep2Dto, user: User): Promise<void> {
    if (user.completeProfile) throw new UnauthorizedException();

    const as = await this.UserModel.updateOne(
      { _id: user._id, completeProfile: false },
      {
        completeProfile: true,
        firstName: profileInfo.firstName,
        lastName: profileInfo.lastName,
        bio: profileInfo.bio.replace(/(\r\n|\n|\r)/gm, ''),
        birthDay: profileInfo.birthDay,
        faculty: profileInfo.faculty,
        interests: profileInfo.interests,
      },
    );
  }

  async signIn(credentials: AuthCredentialsDto): Promise<jwtResponse> {
    const { email, password } = credentials;

    const user = await this.UserModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('wrong credentials');

    return this.signJWT(user);
  }
}
