import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiHideProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { ExcludeProperty } from 'nestjs-mongoose-exclude';
import { Intrest } from '../intrest/intrest.schema';
import { Faculty } from '../university/faculty.schema';
import { University } from '../university/university.schema';

export type UserDocument = User & mongoose.Document;

const Photo = new mongoose.Schema({
  url: String,
  name: String,
});

@Schema({
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
})
export class User {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ default: false })
  @ExcludeProperty()
  completeProfile: boolean;

  @Prop({ default: false })
  @ExcludeProperty()
  isEmailConfirmed: boolean;

  @Prop()
  @ExcludeProperty()
  @ApiHideProperty()
  lastActive: Date;

  @Prop()
  @ExcludeProperty()
  @ApiHideProperty()
  refreshToken: string;

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
  @ApiHideProperty()
  birthDay: Date;

  age: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'University' })
  university: University;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' })
  faculty: Faculty | string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Intrest' }] })
  interests: Intrest[] | string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  @ExcludeProperty()
  @ApiHideProperty()
  likes: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  @ExcludeProperty()
  @ApiHideProperty()
  dislikes: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  @ExcludeProperty()
  @ApiHideProperty()
  matches: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  @ExcludeProperty()
  @ApiHideProperty()
  blocks: User[];

  @Prop({ unique: true, required: true })
  @ExcludeProperty()
  @ApiHideProperty()
  email: string;

  @Prop({ required: true })
  @ExcludeProperty()
  @ApiHideProperty()
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

userSchema.pre('find', function (next) {
  const user = this;
  user.populate('interests university faculty');
  // .populate('university', '-emailDomain -faculties');
  next();
});

userSchema.pre('findOne', function (next) {
  const user = this;
  user.populate('interests university faculty');
  // .populate('university', '-emailDomain -faculties');
  next();
});

userSchema.pre('findOneAndUpdate', function (next) {
  const user = this;
  user.populate('interests university faculty');
  // .populate('university', '-emailDomain -faculties');
  next();
});

export { userSchema };
