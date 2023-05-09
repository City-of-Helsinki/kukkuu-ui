/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EventParticipantsPerInvite } from "./globalTypes";

// ====================================================
// GraphQL query operation: eventTicketmasterPasswordQuery
// ====================================================

export interface eventTicketmasterPasswordQuery_event_ticketSystem_InternalEventTicketSystem {}

export interface eventTicketmasterPasswordQuery_event_ticketSystem_TicketmasterEventTicketSystem {
  childPassword: string | null;
  url: string;
}

export interface eventTicketmasterPasswordQuery_event_ticketSystem_LippupisteEventTicketSystem {
  childPassword: string | null;
  url: string;
}

export type eventTicketmasterPasswordQuery_event_ticketSystem = eventTicketmasterPasswordQuery_event_ticketSystem_InternalEventTicketSystem | eventTicketmasterPasswordQuery_event_ticketSystem_TicketmasterEventTicketSystem | eventTicketmasterPasswordQuery_event_ticketSystem_LippupisteEventTicketSystem;

export interface eventTicketmasterPasswordQuery_event {
  participantsPerInvite: EventParticipantsPerInvite;
  ticketSystem: eventTicketmasterPasswordQuery_event_ticketSystem | null;
}

export interface eventTicketmasterPasswordQuery {
  event: eventTicketmasterPasswordQuery_event | null;
}

export interface eventTicketmasterPasswordQueryVariables {
  id: string;
  childId: string;
}
