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
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import ProfileTypeGuard from 'src/auth/profileType.guard';
import { ProfileTypes } from 'src/auth/profileTypes.enum';
import { UserDocument } from 'src/schema/user/user.schema';
import { GetUser } from 'src/utils/decorators/getUser.decorator';
import { DeletePhotoDto } from 'dto';
import { PhotoService } from './photo.service';

@Controller('photo')
@UseGuards(
  ProfileTypeGuard([ProfileTypes.Complete, ProfileTypes.EmailConfirmed]),
)
export class PhotoController {
  constructor(private photoService: PhotoService) {}

  @Post('uploadProfilePhoto')
  @UseInterceptors(FileInterceptor('photo'))
  async uploadProfilePhoto(
    @UploadedFile() file: Express.MulterS3.File,
    @GetUser() user: UserDocument,
  ): Promise<void> {
    return this.photoService.uploadProfilePhoto(file, user);
  }

  @Post('uploadPhotos')
  @UseInterceptors(FilesInterceptor('photos', 5))
  async uploadPhotos(
    @UploadedFiles() files: Array<Express.MulterS3.File>,
    @GetUser() user: UserDocument,
  ): Promise<void> {
    return this.photoService.uploadPhotos(files, user);
  }

  @Delete('/deletePhotos')
  async deletePhotos(
    @Body() photos: DeletePhotoDto,
    @GetUser() user: UserDocument,
  ): Promise<void> {
    return this.photoService.deletePhotos(photos, user);
  }

  @Get('/:name')
  async getPhoto(
    @Param('name') name: string,
    @GetUser() user: UserDocument,
    @Res() res: Response,
  ) {
    return await this.photoService.getPhoto(name, user, res);
  }
}
