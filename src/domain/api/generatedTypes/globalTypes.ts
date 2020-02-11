/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * An enumeration.
 */
export enum Language {
  EN = "EN",
  FI = "FI",
  SV = "SV",
}

/**
 * An enumeration.
 */
export enum RelationshipType {
  ADVOCATE = "ADVOCATE",
  OTHER_GUARDIAN = "OTHER_GUARDIAN",
  OTHER_RELATION = "OTHER_RELATION",
  PARENT = "PARENT",
}

export enum RelationshipTypeEnum {
  ADVOCATE = "ADVOCATE",
  OTHER_GUARDIAN = "OTHER_GUARDIAN",
  OTHER_RELATION = "OTHER_RELATION",
  PARENT = "PARENT",
}

export interface AddChildMutationInput {
  firstName?: string | null;
  lastName?: string | null;
  birthdate: any;
  postalCode: string;
  relationship?: RelationshipInput | null;
  clientMutationId?: string | null;
}

export interface ChildInput {
  firstName?: string | null;
  lastName?: string | null;
  birthdate: any;
  postalCode: string;
  relationship?: RelationshipInput | null;
}

export interface GuardianInput {
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  language: Language;
}

export interface RelationshipInput {
  type?: RelationshipTypeEnum | null;
}

export interface UpdateMyProfileMutationInput {
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  language?: Language | null;
  clientMutationId?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
