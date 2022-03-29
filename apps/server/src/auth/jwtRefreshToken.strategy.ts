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
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload) {
    const { _id } = payload;
    const user = await this.UserModel.findOne({ id: _id });

    const refreshToken = request.headers?.authorization.split(' ')[1];

    if (!user) throw new UnauthorizedException();

    const valid = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!valid) throw new UnauthorizedException();

    return user;
  }
}
