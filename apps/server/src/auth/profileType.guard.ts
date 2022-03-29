import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { UserDocument } from 'src/schema/user/user.schema';
import JwtAccessGuard from './jwtAccess.guard';
import { ProfileTypes } from './profileTypes.enum';

const ProfileTypeGuard = (type: ProfileTypes[]): Type<CanActivate> => {
  class ProfileTypeGuardMixin extends JwtAccessGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest();
      const user: UserDocument = request.user;

      if (type.includes(ProfileTypes.Uncomplete) && user.completeProfile)
        return false;

      if (type.includes(ProfileTypes.Complete) && !user.completeProfile)
        return false;

      if (
        type.includes(ProfileTypes.EmailNotConfirmed) &&
        user.isEmailConfirmed
      )
        return false;

      if (type.includes(ProfileTypes.EmailConfirmed) && !user.isEmailConfirmed)
        return false;

      return true;
    }
  }

  return mixin(ProfileTypeGuardMixin);
};

export default ProfileTypeGuard;
