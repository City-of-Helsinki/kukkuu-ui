import { gql } from '@apollo/client';

export const eventExternalTicketSystemPasswordCountQuery = gql`
  query eventExternalTicketSystemPasswordCountQuery($id: ID!) {
    event(id: $id) {
      ticketSystem {
        type
        ... on TicketmasterEventTicketSystem {
          freePasswordCount
        }
        ... on LippupisteEventTicketSystem {
          freePasswordCount
        }
        ... on TixlyEventTicketSystem {
          freePasswordCount
        }
      }
    }
  }
`;

export default eventExternalTicketSystemPasswordCountQuery;
