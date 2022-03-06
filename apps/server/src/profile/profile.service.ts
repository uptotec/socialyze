import { ForbiddenException, Injectable } from '@nestjs/common';
import { EditProfileDto } from './dto/editProfile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, User } from 'src/schema/user/user.schema';
import { PhotoService } from '../photo/photo.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,
    private photoService: PhotoService,
  ) {}

  async editProfile(
    editProfileDto: EditProfileDto,
    { _id }: User,
  ): Promise<void> {
    const user = await this.UserModel.findOne(_id);

    user.firstName = editProfileDto.firstName
      ? editProfileDto.firstName
      : user.firstName;

    user.lastName = editProfileDto.lastName
      ? editProfileDto.lastName
      : user.lastName;

    user.bio = editProfileDto.bio
      ? editProfileDto.bio.replace(/(\r\n|\n|\r)/gm, '')
      : user.bio.replace(/(\r\n|\n|\r)/gm, '');

    user.birthDay = editProfileDto.birthDay
      ? editProfileDto.birthDay
      : user.birthDay;

    user.faculty = editProfileDto.faculty
      ? editProfileDto.faculty
      : user.faculty;

    user.interests = editProfileDto.interests
      ? editProfileDto.interests
      : user.interests;

    await user.save();
  }

  async uploadProfilePhoto(
    file: Express.MulterS3.File,
    { _id }: User,
  ): Promise<void> {
    const user = await this.UserModel.findOne(_id);

    if (user.profilePhoto) {
      this.photoService.deletePhoto(user.profilePhoto.name);
    }

    user.profilePhoto = {
      name: file.key,
      url: file.location,
    };
    await user.save();
  }

  async uploadPhotos(
    files: Array<Express.MulterS3.File>,
    { _id }: User,
  ): Promise<void> {
    const user = await this.UserModel.findOne(_id);

    if (user.photos.length + files.length > 5) {
      for (const file of files) {
        this.photoService.deletePhoto(file.key);
      }
      throw new ForbiddenException('Max limit of 5 reached');
    }

    for (const file of files) {
      user.photos.push({ name: file.key, url: file.location });
    }

    await user.save();
  }
}
