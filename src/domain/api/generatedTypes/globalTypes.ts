/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum EventParticipantsPerInvite {
  CHILD_AND_1_OR_2_GUARDIANS = "CHILD_AND_1_OR_2_GUARDIANS",
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

export enum TicketSystem {
  INTERNAL = "INTERNAL",
  LIPPUPISTE = "LIPPUPISTE",
  TICKETMASTER = "TICKETMASTER",
}

export interface AddChildMutationInput {
  firstName?: string | null;
  lastName?: string | null;
  birthdate: any;
  postalCode: string;
  relationship?: RelationshipInput | null;
  languagesSpokenAtHome?: string[] | null;
  clientMutationId?: string | null;
}

export interface AssignTicketSystemPasswordMutationInput {
  eventId: string;
  childId: string;
  clientMutationId?: string | null;
}

export interface ChildInput {
  firstName?: string | null;
  lastName?: string | null;
  birthdate: any;
  postalCode: string;
  relationship?: RelationshipInput | null;
  languagesSpokenAtHome?: string[] | null;
}

export interface DeleteChildMutationInput {
  id: string;
  clientMutationId?: string | null;
}

export interface EnrolOccurrenceMutationInput {
  occurrenceId: string;
  childId: string;
  clientMutationId?: string | null;
}

export interface GuardianInput {
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  language: Language;
  email?: string | null;
  languagesSpokenAtHome?: string[] | null;
}

export interface RelationshipInput {
  type?: RelationshipTypeEnum | null;
}

export interface SubscribeToFreeSpotNotificationMutationInput {
  occurrenceId: string;
  childId: string;
  clientMutationId?: string | null;
}

export interface UnenrolOccurrenceMutationInput {
  occurrenceId: string;
  childId: string;
  clientMutationId?: string | null;
}

export interface UnsubscribeFromFreeSpotNotificationMutationInput {
  occurrenceId: string;
  childId: string;
  clientMutationId?: string | null;
}

export interface UpdateChildMutationInput {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  birthdate?: any | null;
  postalCode?: string | null;
  relationship?: RelationshipInput | null;
  languagesSpokenAtHome?: string[] | null;
  clientMutationId?: string | null;
}

export interface UpdateMyProfileMutationInput {
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  language?: Language | null;
  email?: string | null;
  languagesSpokenAtHome?: string[] | null;
  clientMutationId?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
