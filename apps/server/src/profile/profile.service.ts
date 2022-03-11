import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EditProfileDto } from './dto/editProfile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, User } from 'src/schema/user/user.schema';
import { PhotoService } from '../photo/photo.service';
import { DeletePhotoDto } from './dto/deletePhoto.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,
    private photoService: PhotoService,
  ) {}

  async getProfile(id: string): Promise<User> {
    return await this.UserModel.findOne({ _id: id }).select(
      '-likes -dislikes -matches',
    );
  }

  async getMyProfile({ _id }: User) {
    return this.getProfile(_id.toString());
  }

  async getProfileById(id: string, { _id }: User): Promise<User> {
    const user = await this.getProfile(id);

    if (user.blocks.find((u) => u.toString() === _id.toString()))
      throw new NotFoundException();

    return user;
  }

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

  async deletePhotos({ photos }: DeletePhotoDto, { _id }: User): Promise<void> {
    const user = await this.UserModel.findOne(_id);

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
      this.photoService.deletePhoto(photo);
    }

    await user.save();
  }
}
