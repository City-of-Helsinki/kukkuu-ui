import { gql } from '@apollo/client';

export const eventsSearchQuery = gql`
  fragment SearchEventNodeFields on EventNode {
    id
    name
    shortDescription
    image
    imageAltText
    duration
    participantsPerInvite
    enrolmentDeniedReason(childId: $childId)
    registrationOpensAt
    themePaths {
      id
      slug
      name
    }
    ticketSystem {
      type
      ... on TicketmasterEventTicketSystem {
        childPassword(childId: $childId)
        hasAnyFreePasswords
      }
      ... on LippupisteEventTicketSystem {
        childPassword(childId: $childId)
        hasAnyFreePasswords
      }
      ... on TixlyEventTicketSystem {
        childPassword(childId: $childId)
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

  query eventsSearchQuery(
    $childId: ID!
    $first: Int
    $after: String
    $startDate: Date
    $languages: [String]
    $themePaths: [String]
    $accessibility: [String]
    $familyOnly: Boolean
    $availableOnly: Boolean
  ) {
    child(id: $childId) {
      id
      name
      birthyear
    }
    events(
      childId: $childId
      first: $first
      after: $after
      startDate: $startDate
      languages: $languages
      themePaths: $themePaths
      accessibility: $accessibility
      familyOnly: $familyOnly
      availableOnly: $availableOnly
    ) {
      count
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          ...SearchEventNodeFields
        }
      }
    }
  }
`;
