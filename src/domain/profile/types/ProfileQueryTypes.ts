import { ProfileQuery } from '../../api/generatedTypes/graphql';

export type MyProfile = NonNullable<ProfileQuery['myProfile']>;

export type MyProfileChildren = MyProfile['children'];

export type MyProfileChild = NonNullable<
  NonNullable<MyProfileChildren['edges'][number]>['node']
>;

export type MyProfileEnrolment = NonNullable<
  NonNullable<MyProfileChild['enrolments']['edges'][number]>['node']
>;

export type LanguagesSpokenAtHomeNode = NonNullable<
  MyProfile['languagesSpokenAtHome']['edges'][number]
>['node'];

export type Project = MyProfileChild['project'];
