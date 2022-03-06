import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = User & mongoose.Document;

const Photo = new mongoose.Schema({
  url: String,
  name: String,
});

@Schema()
export class User {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ default: false })
  completeProfile: boolean;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  bio: string;

  @Prop(raw(Photo))
  profilePhoto: Record<string, any>;

  @Prop({
    type: [raw(Photo)],
    validate: [
      (val: Array<string>) => val.length <= 5,
      '{PATH} exceeds the limit of 5',
    ],
  })
  photos: Record<string, any>[];

  @Prop()
  birthDay: Date;

  @Prop()
  university: string;

  @Prop()
  faculty: string;

  @Prop({
    type: [String],
    validate: [
      (val: Array<string>) => val.length <= 15,
      '{PATH} exceeds the limit of 15',
    ],
  })
  interests: string[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
  likes: User[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
  dislikes: User[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
  matches: User[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
  blocks: User[];

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const userSchema = SchemaFactory.createForClass(User);
