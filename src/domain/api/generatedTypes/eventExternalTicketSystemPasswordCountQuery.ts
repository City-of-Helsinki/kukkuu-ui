/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TicketSystem } from './globalTypes';

// ====================================================
// GraphQL query operation: eventExternalTicketSystemPasswordCountQuery
// ====================================================

export interface eventExternalTicketSystemPasswordCountQuery_event_ticketSystem_InternalEventTicketSystem {}

export interface eventExternalTicketSystemPasswordCountQuery_event_ticketSystem_TicketmasterEventTicketSystem {
  freePasswordCount: number | null;
}

export interface eventExternalTicketSystemPasswordCountQuery_event_ticketSystem_LippupisteEventTicketSystem {
  freePasswordCount: number | null;
}

export type eventExternalTicketSystemPasswordCountQuery_event_ticketSystem =
  | eventExternalTicketSystemPasswordCountQuery_event_ticketSystem_InternalEventTicketSystem
  | eventExternalTicketSystemPasswordCountQuery_event_ticketSystem_TicketmasterEventTicketSystem
  | eventExternalTicketSystemPasswordCountQuery_event_ticketSystem_LippupisteEventTicketSystem;

export interface eventExternalTicketSystemPasswordCountQuery_event {
  type: TicketSystem;
  ticketSystem: eventExternalTicketSystemPasswordCountQuery_event_ticketSystem | null;
}

export interface eventExternalTicketSystemPasswordCountQuery {
  event: eventExternalTicketSystemPasswordCountQuery_event | null;
}

export interface eventExternalTicketSystemPasswordCountQueryVariables {
  id: string;
}
