import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import ProfileTypeGuard from 'src/auth/profileType.guard';
import { ProfileTypes } from 'src/auth/profileTypes.enum';
import { UserDocument } from 'src/schema/user/user.schema';
import { GetUser } from 'src/utils/decorators/getUser.decorator';
import { MatchingService } from './matching.service';
import { LikeOrDislikeDto } from 'dto';

@Controller('matching')
@UseGuards(
  ProfileTypeGuard([ProfileTypes.Complete, ProfileTypes.EmailConfirmed]),
)
export class MatchingController {
  constructor(private matchingService: MatchingService) {}

  @Get('/getRecommendations')
  async getRecommendation(@GetUser() user: UserDocument) {
    return this.matchingService.getRecommendations(user);
  }

  @Post('/likeOrDislike')
  async likeOrDislike(
    @GetUser() user: UserDocument,
    @Body() likeOrDislikeDto: LikeOrDislikeDto,
  ) {
    return this.matchingService.likeOrDislike(user, likeOrDislikeDto);
  }

  @Get('/getMatches')
  async getMatches(@GetUser() user: UserDocument) {
    return this.matchingService.getMatches(user);
  }
}
