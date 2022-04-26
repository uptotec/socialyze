import { Module } from '@nestjs/common';
import { User, userSchema } from 'src/schema/user/user.schema';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Intrest, intrestSchema } from 'src/schema/intrest/intrest.schema';
import { Faculty, facultySchema } from 'src/schema/university/faculty.schema';
import {
  University,
  universitySchema,
} from 'src/schema/university/university.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Intrest.name, schema: intrestSchema },
      { name: University.name, schema: universitySchema },
      { name: Faculty.name, schema: facultySchema },
      { name: User.name, schema: userSchema },
    ]),
  ],
  controllers: [MatchingController],
  providers: [MatchingService],
})
export class MatchingModule {}
