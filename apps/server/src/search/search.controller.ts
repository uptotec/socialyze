import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/getUser.decorator';
import { UserDocument } from 'src/schema/user/user.schema';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get('/universities')
  async getUniversities(@Query('name') name: string) {
    return this.searchService.getUniversities(name);
  }

  @Get('/faculties')
  @UseGuards(AuthGuard())
  async getFaculties(
    @Query('name') name: string,
    @GetUser() user: UserDocument,
  ) {
    return this.searchService.getFaculties(name, user);
  }

  @Get('/intrests')
  @UseGuards(AuthGuard())
  async getIntrests(
    @Query('name') name: string,
    @GetUser() user: UserDocument,
  ) {
    return this.searchService.getIntrests(name, user);
  }
}
