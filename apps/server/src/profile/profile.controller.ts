import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/utils/decorators/getUser.decorator';
import { EditProfileDto } from 'dto';
import { ProfileService } from './profile.service';
import { UserDocument } from 'src/schema/user/user.schema';
import ProfileTypeGuard from 'src/auth/profileType.guard';
import { ProfileTypes } from 'src/auth/profileTypes.enum';
import { ObjectIdQueryDto } from 'dto';
import JwtAccessGuard from 'src/auth/jwtAccess.guard';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('/my')
  @UseGuards(JwtAccessGuard)
  async getMyProfile(@GetUser() user: UserDocument) {
    return user;
  }

  @Get('/:id')
  @UseGuards(
    ProfileTypeGuard([ProfileTypes.Complete, ProfileTypes.EmailConfirmed]),
  )
  async getProfileById(
    @Param() { id }: ObjectIdQueryDto,
    @GetUser() user: UserDocument,
  ) {
    return this.profileService.getProfileById(id, user);
  }

  @Post()
  @UseGuards(
    ProfileTypeGuard([ProfileTypes.Complete, ProfileTypes.EmailConfirmed]),
  )
  async editMyProfile(
    @Body() editProfileDto: EditProfileDto,
    @GetUser() user: UserDocument,
  ): Promise<void> {
    return this.profileService.editProfile(editProfileDto, user);
  }
}
