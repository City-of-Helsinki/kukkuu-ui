import { ExternalTicketSystemEventQuery } from '../../api/generatedTypes/graphql';

type TicketSystem = NonNullable<
  NonNullable<ExternalTicketSystemEventQuery['event']>['ticketSystem']
>;

type TicketSystemWithRequiredTypename = TicketSystem &
  Required<Pick<TicketSystem, '__typename'>>;

export type TicketMasterEventTicketSystem = Extract<
  TicketSystemWithRequiredTypename,
  { __typename: 'TicketmasterEventTicketSystem' }
>;

export type LippupisteEventTicketSystem = Extract<
  TicketSystemWithRequiredTypename,
  { __typename: 'LippupisteEventTicketSystem' }
>;

export type EventTicketSystem =
  | TicketMasterEventTicketSystem
  | LippupisteEventTicketSystem;
