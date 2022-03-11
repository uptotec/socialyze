import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ExcludeProperty } from 'nestjs-mongoose-exclude';

export type UserDocument = User & mongoose.Document;

const Photo = new mongoose.Schema({
  url: String,
  name: String,
});

@Schema({
  toJSON: {
    virtuals: true,
  },
})
export class User {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ default: false })
  @ExcludeProperty()
  completeProfile: boolean;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  fullName: string;

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
  @ExcludeProperty()
  birthDay: Date;

  age: number;

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
  @ExcludeProperty()
  likes: User[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
  @ExcludeProperty()
  dislikes: User[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
  @ExcludeProperty()
  matches: User[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
  @ExcludeProperty()
  blocks: User[];

  @Prop({ unique: true, required: true })
  @ExcludeProperty()
  email: string;

  @Prop({ required: true })
  @ExcludeProperty()
  password: string;
}

const userSchema = SchemaFactory.createForClass(User);

userSchema.virtual('fullName').get(function (this: UserDocument) {
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return `${capitalizeFirstLetter(
    this.firstName,
  )} ${capitalizeFirstLetter(this.lastName)}`;
});

userSchema.virtual('age').get(function (this: UserDocument) {
  let today = new Date();
  let birthDate = new Date(this.birthDay);

  let age = today.getFullYear() - birthDate.getFullYear();
  let m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

export { userSchema };
