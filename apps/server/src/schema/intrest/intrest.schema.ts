import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type intrestDocument = Intrest & mongoose.Document;

@Schema()
export class Intrest {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop()
  name: string;
}

const intrestSchema = SchemaFactory.createForClass(Intrest);

export { intrestSchema };
