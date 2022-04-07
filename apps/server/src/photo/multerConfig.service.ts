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
    this.photoService.s3.listBuckets((err, data) => {
      let found: boolean;
      if (err) {
        console.log('Error', err);
        return;
      }

      for (const bucket of data.Buckets) {
        if (bucket.Name === this.photoService.bucket) found = true;
      }

      if (found) return;

      this.photoService.s3.createBucket(
        { Bucket: this.photoService.bucket },
        (err) => {
          if (err) {
            console.log('Error', err);
            return;
          }
        },
      );
    });
    return {
      storage: multerS3({
        s3: this.photoService.s3,
        bucket: this.photoService.bucket,
        acl: 'private',
        key: function (_request, file, cb) {
          cb(null, uuidv4() + path.extname(file.originalname));
        },
        contentType: (req, file, cb) => {
          cb(null, file.mimetype);
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
