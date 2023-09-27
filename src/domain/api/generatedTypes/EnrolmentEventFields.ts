/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EventParticipantsPerInvite } from './globalTypes';

// ====================================================
// GraphQL fragment: EnrolmentEventFields
// ====================================================

export interface EnrolmentEventFields {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  shortDescription: string | null;
  /**
   * In minutes
   */
  duration: number | null;
  image: string;
  imageAltText: string | null;
  participantsPerInvite: EventParticipantsPerInvite;
}
