import { gql } from '@apollo/client';

export const childAvailableEventsQuery = gql`
  fragment SearchEventNodeFields on EventNode {
    id
    name
    shortDescription
    image
    imageAltText
    duration
    enrolmentDeniedReason(childId: $id)
    registrationOpensAt
    ticketSystem {
      type
      ... on TicketmasterEventTicketSystem {
        childPassword(childId: $id)
      }
      ... on LippupisteEventTicketSystem {
        childPassword(childId: $id)
      }
      ... on TixlyEventTicketSystem {
        childPassword(childId: $id)
      }
    }
    occurrences(upcoming: true) {
      edges {
        node {
          id
          time
          remainingCapacity
          occurrenceLanguage
          venue {
            id
            name
            address
          }
        }
      }
    }
  }

  query childAvailableEventsQuery($id: ID!) {
    child(id: $id) {
      id
      name
      birthyear
      upcomingEventsAndEventGroups {
        edges {
          node {
            ... on EventNode {
              ...SearchEventNodeFields
            }
            ... on EventGroupNode {
              id
              name
              events(upcoming: true) {
                edges {
                  node {
                    ...SearchEventNodeFields
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
