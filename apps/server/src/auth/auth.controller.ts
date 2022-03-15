import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { jwtResponse } from './jwt.interface';
import { SignUpStep1Dto, signUpStep2Dto } from './dto/signUp.dto';
import { GetUser } from './getUser.decorator';
import { UserDocument } from 'src/schema/user/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileTypes } from './profileTypes.enum';
import ProfileTypeGuard from './profileType.guard';
import { ConfirmMailDto } from './dto/confirmMail.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup/step1')
  async signUpStep1(@Body() credentials: SignUpStep1Dto): Promise<jwtResponse> {
    return this.authService.signUpStep1(credentials);
  }

  @Post('/confirmMail')
  @UseGuards(
    ProfileTypeGuard([ProfileTypes.Uncomplete, ProfileTypes.EmailNotConfirmed]),
  )
  async confirmMail(
    @Body() code: ConfirmMailDto,
    @GetUser() user: UserDocument,
  ): Promise<void> {
    return this.authService.confirmMail(code, user);
  }

  @Get('/resendConfirmMail')
  @UseGuards(
    ProfileTypeGuard([ProfileTypes.Uncomplete, ProfileTypes.EmailNotConfirmed]),
  )
  async resendConfirmMail(@GetUser() user: UserDocument) {
    return this.authService.resendConfirmMail(user);
  }

  @Post('/signup/step2')
  @UseGuards(
    ProfileTypeGuard([ProfileTypes.Uncomplete, ProfileTypes.EmailConfirmed]),
  )
  @UseInterceptors(FileInterceptor('photo'))
  async signUpStep2(
    @Body() profileInfo: signUpStep2Dto,
    @GetUser() user: UserDocument,
    @UploadedFile() profilePic: Express.MulterS3.File,
  ): Promise<void> {
    return this.authService.signUpStep2(profileInfo, profilePic, user);
  }

  @Post('/signin')
  async signIn(@Body() credentials: AuthCredentialsDto): Promise<jwtResponse> {
    return this.authService.signIn(credentials);
  }
}
