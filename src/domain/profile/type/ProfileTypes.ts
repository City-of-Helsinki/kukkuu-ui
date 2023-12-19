import { ProfileQuery } from '../../api/generatedTypes/graphql';

export type ProfileType = NonNullable<ProfileQuery['myProfile']>;

export type LanguagesSpokenAtHomeNode = NonNullable<
  NonNullable<
    ProfileQuery['myProfile']
  >['languagesSpokenAtHome']['edges'][number]
>['node'];
