import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multerConfig.service';
import { PhotoController } from './photo.controller';
import { User, userSchema } from 'src/schema/user/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [PhotoModule],
      inject: [PhotoService],
      useClass: MulterConfigService,
    }),
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
  ],
  providers: [PhotoService],
  exports: [MulterModule, PhotoService],
  controllers: [PhotoController],
})
export class PhotoModule {}
