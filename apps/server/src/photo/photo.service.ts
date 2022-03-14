import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as aws from 'aws-sdk';

@Injectable()
export class PhotoService {
  constructor(private configService: ConfigService) {}

  bucket = this.configService.get<string>('s3_bucket');

  s3 = new aws.S3({
    endpoint: this.configService.get<string>('s3_endpoint'),
    accessKeyId: this.configService.get<string>('s3_AccessKeyId'),
    secretAccessKey: this.configService.get<string>('s3_secretAccessKey'),
    s3ForcePathStyle: true,
  });

  deletePhoto(name: string): Promise<void> {
    this.s3.deleteObject(
      { Key: name, Bucket: this.bucket },
      function (err, data) {
        if (err) console.log(err, err.stack);
      },
    );
    return;
  }

  async getPhotoUrl(key: string) {
    return this.s3.getSignedUrlPromise('getObject', {
      Bucket: this.bucket,
      Key: key,
      Expires: 60 * 1,
    });
  }
}
