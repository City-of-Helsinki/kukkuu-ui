import { gql } from '@apollo/client';

export const childAvailableEventsQuery = gql`
  fragment SearchEventNodeFields on EventNode {
    id
    name
    shortDescription
    image
    imageAltText
    duration
    participantsPerInvite
    enrolmentDeniedReason(childId: $id)
    registrationOpensAt
    themePaths {
      id
      slug
      name
    }
    ticketSystem {
      type
      ... on TicketmasterEventTicketSystem {
        childPassword(childId: $id)
        hasAnyFreePasswords
      }
      ... on LippupisteEventTicketSystem {
        childPassword(childId: $id)
        hasAnyFreePasswords
      }
      ... on TixlyEventTicketSystem {
        childPassword(childId: $id)
        hasAnyFreePasswords
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
      themePath {
        id
        slug
        name
      }
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
