import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Intrest, intrestSchema } from 'src/schema/intrest/intrest.schema';
import { Faculty, facultySchema } from 'src/schema/university/faculty.schema';
import {
  University,
  universitySchema,
} from 'src/schema/university/university.schema';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Intrest.name, schema: intrestSchema },
      { name: University.name, schema: universitySchema },
      { name: Faculty.name, schema: facultySchema },
    ]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
