/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EventParticipantsPerInvite } from "./globalTypes";

// ====================================================
// GraphQL query operation: eventExternalTicketSystemPasswordQuery
// ====================================================

export interface eventExternalTicketSystemPasswordQuery_event_ticketSystem_InternalEventTicketSystem {}

export interface eventExternalTicketSystemPasswordQuery_event_ticketSystem_TicketmasterEventTicketSystem {
  childPassword: string | null;
  url: string;
}

export interface eventExternalTicketSystemPasswordQuery_event_ticketSystem_LippupisteEventTicketSystem {
  childPassword: string | null;
  url: string;
}

export type eventExternalTicketSystemPasswordQuery_event_ticketSystem = eventExternalTicketSystemPasswordQuery_event_ticketSystem_InternalEventTicketSystem | eventExternalTicketSystemPasswordQuery_event_ticketSystem_TicketmasterEventTicketSystem | eventExternalTicketSystemPasswordQuery_event_ticketSystem_LippupisteEventTicketSystem;

export interface eventExternalTicketSystemPasswordQuery_event {
  participantsPerInvite: EventParticipantsPerInvite;
  ticketSystem: eventExternalTicketSystemPasswordQuery_event_ticketSystem | null;
}

export interface eventExternalTicketSystemPasswordQuery {
  event: eventExternalTicketSystemPasswordQuery_event | null;
}

export interface eventExternalTicketSystemPasswordQueryVariables {
  id: string;
  childId: string;
}
