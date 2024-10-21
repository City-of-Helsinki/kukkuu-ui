import {
  TicketmasterEventFieldsFragment,
  LippupisteEventFieldsFragment,
  TixlyEventFieldsFragment,
} from '../../api/generatedTypes/graphql';

export type EventTicketSystem =
  | TicketmasterEventFieldsFragment
  | LippupisteEventFieldsFragment
  | TixlyEventFieldsFragment;
