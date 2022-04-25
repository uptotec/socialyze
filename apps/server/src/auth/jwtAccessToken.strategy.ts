import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'dto';
import { User, UserDocument } from '../schema/user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access-token',
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
      secretOrKey: _configService.get('JWT_ACCESS_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    const { _id } = payload;
    const user = await this.UserModel.findOneAndUpdate(
      { _id: _id },
      { lastActive: new Date() },
    );

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
