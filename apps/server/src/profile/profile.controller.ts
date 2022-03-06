import {
  Body,
  Controller,
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

@Controller('profile')
@UseGuards(AuthGuard())
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('/my')
  async getMyProfile() {}

  @Get('/:id')
  async getProfileById(@Param('id') id: string) {}

  @Post()
  async editMyProfile(
    @Body() editProfileDto: EditProfileDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.profileService.editProfile(editProfileDto, user);
  }

  @Post('uploadProfilePhoto')
  @UseInterceptors(FileInterceptor('photo'))
  uploadProfilePhoto(
    @UploadedFile() file: Express.MulterS3.File,
    @GetUser() user: User,
  ): Promise<void> {
    return this.profileService.uploadProfilePhoto(file, user);
  }

  @Post('uploadPhotos')
  @UseInterceptors(FilesInterceptor('photos', 5))
  uploadPhotos(
    @UploadedFiles() files: Array<Express.MulterS3.File>,
    @GetUser() user: User,
  ): Promise<void> {
    return this.profileService.uploadPhotos(files, user);
  }
}
