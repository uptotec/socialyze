import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/auth/getUser.decorator';
import { EditProfileDto } from './dto/editProfile.dto';
import { ProfileService } from './profile.service';
import { User, UserDocument } from 'src/schema/user/user.schema';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { DeletePhotoDto } from './dto/deletePhoto.dto';
import { Response } from 'express';
import ProfileTypeGuard from 'src/auth/profileType.guard';
import { ProfileTypes } from 'src/auth/profileTypes.enum';

@Controller('profile')
@UseGuards(ProfileTypeGuard(ProfileTypes.Complete))
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('/my')
  async getMyProfile(@GetUser() user: UserDocument): Promise<User> {
    return user;
  }

  @Get('/:id')
  async getProfileById(@Param('id') id: string, @GetUser() user: UserDocument) {
    return this.profileService.getProfileById(id, user);
  }

  @Post()
  async editMyProfile(
    @Body() editProfileDto: EditProfileDto,
    @GetUser() user: UserDocument,
  ): Promise<void> {
    return this.profileService.editProfile(editProfileDto, user);
  }

  @Post('uploadProfilePhoto')
  @UseInterceptors(FileInterceptor('photo'))
  async uploadProfilePhoto(
    @UploadedFile() file: Express.MulterS3.File,
    @GetUser() user: UserDocument,
  ): Promise<void> {
    return this.profileService.uploadProfilePhoto(file, user);
  }

  @Post('uploadPhotos')
  @UseInterceptors(FilesInterceptor('photos', 5))
  async uploadPhotos(
    @UploadedFiles() files: Array<Express.MulterS3.File>,
    @GetUser() user: UserDocument,
  ): Promise<void> {
    return this.profileService.uploadPhotos(files, user);
  }

  @Delete('/deletePhotos')
  async deletePhotos(
    @Body() photos: DeletePhotoDto,
    @GetUser() user: UserDocument,
  ): Promise<void> {
    return this.profileService.deletePhotos(photos, user);
  }

  @Get('/photo/:id')
  async getPhoto(
    @Param('id') id: string,
    @GetUser() user: UserDocument,
    @Res() res: Response,
  ) {
    return await this.profileService.getPhoto(id, user, res);
  }
}
