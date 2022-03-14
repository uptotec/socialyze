import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Intrest, IntrestDocument } from 'src/schema/intrest/intrest.schema';
import { Faculty, FacultyDocument } from 'src/schema/university/faculty.schema';
import {
  University,
  UniversityDocument,
} from 'src/schema/university/university.schema';
import { User } from 'src/schema/user/user.schema';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(University.name)
    private UniversityModel: Model<UniversityDocument>,
    @InjectModel(Faculty.name)
    private FacultyModel: Model<FacultyDocument>,
    @InjectModel(Intrest.name)
    private IntrestModel: Model<IntrestDocument>,
  ) {}

  async getUniversities(uniName: string) {
    return this.UniversityModel.find({
      name: { $regex: uniName || '', $options: 'i' },
    }).limit(20);
  }

  async getFaculties(facName: string, user: User) {
    return this.FacultyModel.find({
      name: { $regex: facName || '', $options: 'i' },
      _id: { $in: user.university.faculties },
    }).limit(20);
  }

  async getIntrests(name: string, user: User) {
    return this.IntrestModel.find({
      name: { $regex: name || '', $options: 'i' },
    }).limit(20);
  }
}
