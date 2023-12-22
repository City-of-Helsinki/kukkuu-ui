import {
  TicketmasterEventFieldsFragment,
  LippupisteEventFieldsFragment,
} from '../../api/generatedTypes/graphql';

export type EventTicketSystem =
  | TicketmasterEventFieldsFragment
  | LippupisteEventFieldsFragment;
