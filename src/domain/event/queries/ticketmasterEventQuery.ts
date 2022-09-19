import { gql } from '@apollo/client';

export const ticketmasterEventQuery = gql`
  query ticketmasterEventQuery($eventId: ID!, $childId: ID!) {
    event(id: $eventId) {
      id
      name
      description
      image
      imageAltText
      participantsPerInvite
      occurrences: occurrences(upcoming: true, first: 1) {
        edges {
          node {
            ticketSystem {
              type
              ... on TicketmasterOccurrenceTicketSystem {
                url
              }
            }
          }
        }
      }
      ticketSystem {
        type
        ... on TicketmasterEventTicketSystem {
          childPassword(childId: $childId)
        }
      }
    }
  }
`;
