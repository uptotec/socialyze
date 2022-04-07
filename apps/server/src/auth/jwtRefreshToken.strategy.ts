import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './dto/jwt.dto';
import { User, UserDocument } from '../schema/user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  public get configService(): ConfigService {
    return this._configService;
  }
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,
    private _configService: ConfigService,
  ) {
    super({
      secretOrKey: _configService.get('JWT_REFRESH_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload) {
    const { _id } = payload;

    const user = await this.UserModel.findOne({ id: _id }).select(
      '-likes -dislikes -matches -blocks',
    );

    if (!user || !user.refreshToken) throw new UnauthorizedException();

    const refreshToken = request.headers?.authorization
      .split(' ')[1]
      .split('.')[2];

    const valid = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!valid) throw new UnauthorizedException();

    return user;
  }
}
