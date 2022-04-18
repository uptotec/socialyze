import { Injectable, NotFoundException } from '@nestjs/common';
import { EditProfileDto } from 'dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, User } from 'src/schema/user/user.schema';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,
  ) {}

  async getProfileById(id: string, { _id }: User): Promise<User> {
    const user = await this.UserModel.findOne({ _id: id }).select(
      '-likes -dislikes -matches',
    );

    if (user.blocks.find((u) => u.toString() === _id.toString()))
      throw new NotFoundException();

    return user;
  }

  async editProfile(
    editProfileDto: EditProfileDto,
    user: UserDocument,
  ): Promise<void> {
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
}
