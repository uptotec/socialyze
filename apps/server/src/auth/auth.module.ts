import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthService } from './auth.service';
import { JwtAccessStrategy } from './jwtAccessToken.strategy';
import { userSchema, User } from '../schema/user/user.schema';
import { PhotoModule } from '../photo/photo.module';
import {
  University,
  universitySchema,
} from 'src/schema/university/university.schema';
import { JwtRefreshStrategy } from './jwtRefreshToken.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: University.name, schema: universitySchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    PhotoModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
  exports: [JwtAccessStrategy, JwtRefreshStrategy, PassportModule],
})
export class AuthModule {}
