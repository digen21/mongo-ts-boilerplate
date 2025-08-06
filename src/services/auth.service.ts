import { User } from '@src/models';
import { IUser } from '@src/types';
import CommonService from './common.service';

export const findOrCreateGoogleUser = async (profile: any) => {
  const commonService = new CommonService<IUser>(User);
  let user = await commonService.findOne({ providerId: profile.id });

  if (!user) {
    user = await commonService.create({
      providerId: profile.id,
      username: profile.displayName,
      email: profile.emails[0].value,
      imageUrl: profile.photos[0].value,
      isEmailVerified: profile.emails[0].verified || false,
    });
  }
  return user;
};
