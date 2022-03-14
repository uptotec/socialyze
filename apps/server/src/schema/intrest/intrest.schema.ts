import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type IntrestDocument = Intrest & mongoose.Document;

@Schema({
  toJSON: {
    virtuals: true,
  },
})
export class Intrest {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop()
  name: string;
}

const intrestSchema = SchemaFactory.createForClass(Intrest);

export { intrestSchema };
