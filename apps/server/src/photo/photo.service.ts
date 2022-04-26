import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as aws from 'aws-sdk';
import { Response } from 'express';
import { User, UserDocument } from 'src/schema/user/user.schema';
import { DeletePhotoDto } from 'dto';
import { Model } from 'mongoose';

@Injectable()
export class PhotoService {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,
  ) {}

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

  async uploadProfilePhoto(
    file: Express.MulterS3.File,
    user: UserDocument,
  ): Promise<void> {
    if (user.profilePhoto) {
      this.deletePhoto(user.profilePhoto.name);
    }

    user.profilePhoto = {
      name: file.key,
      url: `/photo/${file.key}`,
    };
    await user.save();
  }

  async uploadPhotos(
    files: Array<Express.MulterS3.File>,
    user: UserDocument,
  ): Promise<void> {
    if (user.photos.length + files.length > 5) {
      for (const file of files) {
        this.deletePhoto(file.key);
      }
      throw new ForbiddenException('Max limit of 5 reached');
    }

    for (const file of files) {
      user.photos.push({ name: file.key, url: `/photo/${file.key}` });
    }

    await user.save();
  }

  async deletePhotos(
    { photos }: DeletePhotoDto,
    user: UserDocument,
  ): Promise<void> {
    for (const photo of photos) {
      const p = user.photos.find((p) => p.name === photo);
      if (!p) {
        throw new BadRequestException(
          "some photos doesn't exists for this user",
        );
      }
    }

    for (const photo of photos) {
      user.photos.splice(
        user.photos.findIndex((ph) => ph.name === photo),
        1,
      );
      this.deletePhoto(photo);
    }

    await user.save();
  }

  async getPhoto(id: string, res: Response) {
    // const photoOwner = await this.UserModel.exists({
    //   $or: [{ 'profilePhoto.name': id }, { 'photos.name': id }],
    //   blocks: { $ne: user._id },
    // });

    // if (!photoOwner) throw new NotFoundException();

    const url = await this.getPhotoUrl(id);

    if (!url) throw new NotFoundException();

    if (process.env.NODE_ENV === 'development')
      res.redirect(302, url.replace('s3', '0.0.0.0'));
    else res.redirect(303, url);
  }
}
