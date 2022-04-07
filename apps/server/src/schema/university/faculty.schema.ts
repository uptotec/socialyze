import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type FacultyDocument = Faculty & mongoose.Document;

@Schema({
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
})
export class Faculty {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop()
  name: string;
}

const facultySchema = SchemaFactory.createForClass(Faculty);

export { facultySchema };
