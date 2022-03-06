import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { jwtResponse } from './jwt.interface';
import { SignUpStep1Dto, SignUpStep2Dto } from './dto/signUp.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './getUser.decorator';
import { User } from 'src/schema/user/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup/step1')
  async signUpStep1(@Body() credentials: SignUpStep1Dto): Promise<jwtResponse> {
    return this.authService.signUpStep1(credentials);
  }

  @Post('/signup/step2')
  @UseGuards(AuthGuard())
  async signUpStep2(
    @Body() profileInfo: SignUpStep2Dto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.authService.signUpStep2(profileInfo, user);
  }

  @Post('/signin')
  async signIn(@Body() credentials: AuthCredentialsDto): Promise<jwtResponse> {
    return this.authService.signIn(credentials);
  }
}
