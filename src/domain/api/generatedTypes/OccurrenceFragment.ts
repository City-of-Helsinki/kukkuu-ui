/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: OccurrenceFragment
// ====================================================

export interface OccurrenceFragment_event {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  /**
   * In minutes
   */
  duration: number | null;
}

export interface OccurrenceFragment_venue {
  /**
   * The ID of the object.
   */
  id: string;
  name: string | null;
  address: string | null;
}

export interface OccurrenceFragment {
  /**
   * The ID of the object.
   */
  id: string;
  time: any;
  remainingCapacity: number | null;
  event: OccurrenceFragment_event;
  venue: OccurrenceFragment_venue;
  childHasFreeSpotNotificationSubscription: boolean | null;
}
