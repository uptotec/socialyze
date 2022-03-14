import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from '../schema/user/user.schema';
import { PhotoModule } from '../photo/photo.module';
import { Intrest, intrestSchema } from 'src/schema/intrest/intrest.schema';
import {
  University,
  universitySchema,
} from 'src/schema/university/university.schema';
import { Faculty, facultySchema } from 'src/schema/university/faculty.schema';
@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Intrest.name, schema: intrestSchema },
      { name: University.name, schema: universitySchema },
      { name: Faculty.name, schema: facultySchema },
    ]),
    PhotoModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
