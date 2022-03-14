import { Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

export function toMongoObjectId({ value, key }): Types.ObjectId {
  if (
    Types.ObjectId.isValid(value) &&
    Types.ObjectId.createFromHexString(value).toString() === value
  ) {
    return Types.ObjectId.createFromHexString(value) as Types.ObjectId;
  } else {
    throw new BadRequestException(`${key} is not a valid MongoId`);
  }
}
