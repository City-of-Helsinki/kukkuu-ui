import {
  LanguageSpokenAtHomeFieldsFragment,
  MyProfileChildProjectFieldsFragment,
  MyProfileEnrolmentFieldsFragment,
  MyProfileFieldsFragment,
  MyProfileChildrenFieldsFragment,
  MyProfileChildFieldsFragment,
} from '../../api/generatedTypes/graphql';

export type MyProfile = MyProfileFieldsFragment;

export type MyProfileChildren = MyProfileChildrenFieldsFragment;

export type MyProfileChild = MyProfileChildFieldsFragment;

export type MyProfileEnrolment = MyProfileEnrolmentFieldsFragment;

export type LanguagesSpokenAtHomeNode = LanguageSpokenAtHomeFieldsFragment;

export type Project = MyProfileChildProjectFieldsFragment;
