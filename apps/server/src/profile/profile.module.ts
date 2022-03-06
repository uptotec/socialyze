import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from '../schema/user/user.schema';
import { PhotoModule } from '../photo/photo.module';
@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    PhotoModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
