import { gql } from '@apollo/client';

export const externalTicketSystemEventQuery = gql`
  query externalTicketSystemEventQuery($eventId: ID!, $childId: ID!) {
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
              ... on LippupisteOccurrenceTicketSystem {
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
          url
        }
        ... on LippupisteEventTicketSystem {
          childPassword(childId: $childId)
          url
        }
      }
    }
  }
`;
