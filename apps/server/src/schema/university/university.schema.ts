import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ExcludeProperty } from 'nestjs-mongoose-exclude';
import { Faculty } from './faculty.schema';

export type UniversityDocument = University & mongoose.Document;

@Schema()
export class University {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  @ExcludeProperty()
  emailDomain: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' }] })
  @ExcludeProperty()
  faculties: Faculty[] | string[];
}

const universitySchema = SchemaFactory.createForClass(University);

export { universitySchema };
