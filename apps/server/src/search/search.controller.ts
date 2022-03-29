import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/utils/decorators/getUser.decorator';
import { UserDocument } from 'src/schema/user/user.schema';
import { SearchService } from './search.service';
import JwtAccessGuard from 'src/auth/jwtAccess.guard';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get('/universities')
  async getUniversities(@Query('name') name: string) {
    return this.searchService.getUniversities(name);
  }

  @Get('/faculties')
  @UseGuards(JwtAccessGuard)
  async getFaculties(
    @Query('name') name: string,
    @GetUser() user: UserDocument,
  ) {
    return this.searchService.getFaculties(name, user);
  }

  @Get('/intrests')
  @UseGuards(JwtAccessGuard)
  async getIntrests(
    @Query('name') name: string,
    @GetUser() user: UserDocument,
  ) {
    return this.searchService.getIntrests(name, user);
  }
}
