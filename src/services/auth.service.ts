import { Profile } from 'passport-google-oauth20';
import { User } from '../models';
import { IUser } from '../types';
import CommonService from './common.service';

export const findOrCreateGoogleUser = async (profile: Profile) => {
  const commonService = new CommonService<IUser>(User);
  let user = await commonService.findOne({ providerId: profile.id });

  if (!user) {
    user = await commonService.create({
      providerId: profile.id,
      username: profile.displayName,
      email: profile.emails?.[0].value!,
      imageUrl: profile?.photos?.[0].value,
      provider: profile.provider,
      firstName: profile?.name?.givenName,
      lastName: profile?.name?.familyName,
      lastLoginAt: new Date(),
      isEmailVerified: profile?.emails?.[0].verified || false,
    });
  }
  return user;
};
