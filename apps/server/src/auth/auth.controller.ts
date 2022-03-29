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
import { JwtResponse } from './dto/jwt.dto';
import { SignUpStep1Dto, signUpStep2Dto } from './dto/signUp.dto';
import { GetUser } from '../utils/decorators/getUser.decorator';
import { UserDocument } from 'src/schema/user/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileTypes } from './profileTypes.enum';
import ProfileTypeGuard from './profileType.guard';
import { ConfirmMailDto } from './dto/confirmMail.dto';
import { Throttle } from '@nestjs/throttler';
import JwtRefreshGuard from './jwtRefresh.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup/step1')
  async signUpStep1(@Body() credentials: SignUpStep1Dto): Promise<JwtResponse> {
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
  @Throttle(1, 60)
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
  async signIn(@Body() credentials: AuthCredentialsDto): Promise<JwtResponse> {
    return this.authService.signIn(credentials);
  }

  @Get('/refreash')
  @UseGuards(JwtRefreshGuard)
  async refreshJwt(@GetUser() user: UserDocument) {
    return this.authService.RefreshAccessToken(user);
  }
}
