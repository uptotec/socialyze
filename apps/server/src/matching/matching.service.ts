import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schema/user/user.schema';
import mongoose from 'mongoose';
import { LikeOrDislikeDto } from 'dto';

@Injectable()
export class MatchingService {
  constructor(
    @InjectModel(User.name)
    private UserModel: mongoose.Model<UserDocument>,
  ) {}

  async getRecommendations(user: UserDocument) {
    const x = await this.UserModel.find({
      _id: {
        $nin: [user._id, ...user.likes, ...user.dislikes, ...user.blocks],
      },
      university: user.university._id,
      interests: { $in: user.interests },
      dislikes: { $ne: user._id },
      blocks: { $ne: user._id },
      matches: { $ne: user._id },
    }).limit(15);
    return x;
  }

  async likeOrDislike(user: UserDocument, { userId, type }: LikeOrDislikeDto) {
    if (type === 'dislike') {
      user.dislikes.push(userId as any);
      await user.save();
      return;
    }

    const likedBack = await this.UserModel.findOne({
      _id: userId,
      likes: { $in: user._id },
    });

    if (!likedBack) {
      user.likes.push(new mongoose.mongo.ObjectId(userId) as any);
      await user.save();
      return;
    }

    user.matches.push(new mongoose.mongo.ObjectId(userId) as any);
    likedBack.matches.push(user._id);
    likedBack.likes = likedBack.likes.filter((u) => u._id != user._id);

    await user.save();
    await likedBack.save();
    return;
  }

  async getMatches(user: UserDocument) {
    return (await user.populate('matches')).matches;
  }
}
