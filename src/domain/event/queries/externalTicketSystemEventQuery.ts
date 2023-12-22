import { gql } from '@apollo/client';

export const externalTicketSystemEventQuery = gql`
  fragment TicketmasterEventFields on TicketmasterEventTicketSystem {
    childPassword(childId: $childId)
    url
  }

  fragment LippupisteEventFields on LippupisteEventTicketSystem {
    childPassword(childId: $childId)
    url
  }

  fragment ExternalTicketSystemEventFields on EventNode {
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
        ...TicketmasterEventFields
      }
      ... on LippupisteEventTicketSystem {
        ...LippupisteEventFields
      }
    }
  }

  query externalTicketSystemEventQuery($eventId: ID!, $childId: ID!) {
    event(id: $eventId) {
      ...ExternalTicketSystemEventFields
    }
  }
`;
