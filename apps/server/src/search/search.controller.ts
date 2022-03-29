import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/utils/decorators/getUser.decorator';
import { UserDocument } from 'src/schema/user/user.schema';
import { SearchService } from './search.service';
import JwtAccessGuard from 'src/auth/jwtAccess.guard';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('search')
@ApiTags('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get('/universities')
  @ApiParam({
    name: 'name',
    required: false,
    description: 'name to search for in the database',
    type: String,
  })
  async getUniversities(@Query('name') name: string) {
    return this.searchService.getUniversities(name);
  }

  @Get('/faculties')
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'name',
    required: false,
    description: 'name to search for in the database',
    type: String,
  })
  async getFaculties(
    @Query('name') name: string,
    @GetUser() user: UserDocument,
  ) {
    return this.searchService.getFaculties(name, user);
  }

  @Get('/intrests')
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'name',
    required: false,
    description: 'name to search for in the database',
    type: String,
  })
  async getIntrests(
    @Query('name') name: string,
    @GetUser() user: UserDocument,
  ) {
    return this.searchService.getIntrests(name, user);
  }
}
