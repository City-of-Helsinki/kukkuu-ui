/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * An enumeration.
 */
export enum EventParticipantsPerInvite {
  CHILD_AND_GUARDIAN = "CHILD_AND_GUARDIAN",
  FAMILY = "FAMILY",
}

/**
 * An enumeration.
 */
export enum Language {
  EN = "EN",
  FI = "FI",
  SV = "SV",
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

export interface DeleteChildMutationInput {
  id: string;
  clientMutationId?: string | null;
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

export interface UpdateChildMutationInput {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  birthdate?: any | null;
  postalCode?: string | null;
  relationship?: RelationshipInput | null;
  clientMutationId?: string | null;
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
