import { Injectable, NotAcceptableException } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import multerS3 from 'multer-s3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PhotoService } from './photo.service';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private photoService: PhotoService) {}

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: multerS3({
        s3: this.photoService.s3,
        bucket: this.photoService.bucket,
        acl: 'public-read',
        key: function (_request, file, cb) {
          cb(null, uuidv4() + path.extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
          return cb(
            new NotAcceptableException('Only images are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    };
  }
}
