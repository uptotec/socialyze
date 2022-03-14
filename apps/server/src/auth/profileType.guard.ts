import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDocument } from 'src/schema/user/user.schema';
import { ProfileTypes } from './profileTypes.enum';

const ProfileTypeGuard = (type: ProfileTypes): Type<CanActivate> => {
  class ProfileTypeGuardMixin extends AuthGuard('jwt') {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest();
      const user: UserDocument = request.user;

      if (type === ProfileTypes.Uncomplete && user.completeProfile)
        return false;

      if (type === ProfileTypes.Complete && !user.completeProfile) return false;

      return true;
    }
  }

  return mixin(ProfileTypeGuardMixin);
};

export default ProfileTypeGuard;
