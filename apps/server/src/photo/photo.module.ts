import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multerConfig.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [PhotoModule],
      inject: [PhotoService],
      useClass: MulterConfigService,
    }),
  ],
  providers: [PhotoService],
  exports: [MulterModule, PhotoService],
})
export class PhotoModule {}
