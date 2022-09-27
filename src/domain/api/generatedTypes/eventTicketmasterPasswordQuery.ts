/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: eventTicketmasterPasswordQuery
// ====================================================

export interface eventTicketmasterPasswordQuery_event_ticketSystem_InternalEventTicketSystem {}

export interface eventTicketmasterPasswordQuery_event_ticketSystem_TicketmasterEventTicketSystem {
  childPassword: string;
}

export type eventTicketmasterPasswordQuery_event_ticketSystem = eventTicketmasterPasswordQuery_event_ticketSystem_InternalEventTicketSystem | eventTicketmasterPasswordQuery_event_ticketSystem_TicketmasterEventTicketSystem;

export interface eventTicketmasterPasswordQuery_event {
  ticketSystem: eventTicketmasterPasswordQuery_event_ticketSystem | null;
}

export interface eventTicketmasterPasswordQuery {
  event: eventTicketmasterPasswordQuery_event | null;
}

export interface eventTicketmasterPasswordQueryVariables {
  id: string;
  childId: string;
}
