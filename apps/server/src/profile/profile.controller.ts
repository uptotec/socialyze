import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/getUser.decorator';
import { EditProfileDto } from './dto/editProfile.dto';
import { ProfileService } from './profile.service';
import { User } from 'src/schema/user/user.schema';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { DeletePhotoDto } from './dto/deletePhoto.dto';

@Controller('profile')
@UseGuards(AuthGuard())
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('/my')
  async getMyProfile(@GetUser() user: User): Promise<User> {
    return this.profileService.getMyProfile(user);
  }

  @Get('/:id')
  async getProfileById(@Param('id') id: string, @GetUser() user: User) {
    return this.profileService.getProfileById(id, user);
  }

  @Post()
  async editMyProfile(
    @Body() editProfileDto: EditProfileDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.profileService.editProfile(editProfileDto, user);
  }

  @Post('uploadProfilePhoto')
  @UseInterceptors(FileInterceptor('photo'))
  async uploadProfilePhoto(
    @UploadedFile() file: Express.MulterS3.File,
    @GetUser() user: User,
  ): Promise<void> {
    return this.profileService.uploadProfilePhoto(file, user);
  }

  @Post('uploadPhotos')
  @UseInterceptors(FilesInterceptor('photos', 5))
  async uploadPhotos(
    @UploadedFiles() files: Array<Express.MulterS3.File>,
    @GetUser() user: User,
  ): Promise<void> {
    return this.profileService.uploadPhotos(files, user);
  }

  @Delete('/deletePhotos')
  async deletePhotos(
    @Body() photos: DeletePhotoDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.profileService.deletePhotos(photos, user);
  }
}
