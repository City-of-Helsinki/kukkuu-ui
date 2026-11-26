import { gql } from '@apollo/client';

const eventQueryFragments = gql`
  fragment EventOccurrenceFields on OccurrenceNode {
    id
    time
    remainingCapacity
    languages {
      alpha3Code
      name
    }
    event {
      id
      name
      duration
    }
    venue {
      id
      name
      address
      description
      accessibilityInfo
      arrivalInstructions
      wcAndFacilities
      wwwUrl
    }
    childHasFreeSpotNotificationSubscription(childId: $childId)
    ticketSystem {
      type
      ... on TicketmasterOccurrenceTicketSystem {
        url
      }
      ... on LippupisteOccurrenceTicketSystem {
        url
      }
      ... on TixlyOccurrenceTicketSystem {
        url
      }
    }
  }

  fragment EventOccurrencesFields on OccurrenceNodeConnection {
    edges {
      node {
        ...EventOccurrenceFields
      }
    }
  }
`;

const eventQuery = gql`
  query eventQuery($id: ID!, $date: Date, $time: Time, $childId: ID!) {
    event(id: $id) {
      id
      name
      description
      shortDescription
      image
      imageAltText
      participantsPerInvite
      duration
      capacityPerOccurrence
      enrolmentDeniedReason(childId: $childId)
      registrationOpensAt
      themePaths {
        id
        slug
        name
      }
      eventGroup {
        id
      }
      occurrences(upcoming: true, date: $date, time: $time) {
        ...EventOccurrencesFields
      }
      allOccurrences: occurrences(upcoming: true) {
        ...EventOccurrencesFields
      }
      ticketSystem {
        type
        ... on TicketmasterEventTicketSystem {
          childPassword(childId: $childId)
          hasAnyFreePasswords
          url
        }
        ... on LippupisteEventTicketSystem {
          childPassword(childId: $childId)
          hasAnyFreePasswords
          url
        }
        ... on TixlyEventTicketSystem {
          childPassword(childId: $childId)
          hasAnyFreePasswords
          url
        }
      }
    }
  }

  ${eventQueryFragments}
`;

/**
 * @deprecated Legacy password query for `EventRedirect`.
 * Superseded by `EventTicketSystemSection` using `eventExternalTicketSystemHasAnyFreePasswordsQuery`
 * and `eventQuery`.
 */
export const eventExternalTicketSystemPasswordQuery = gql`
  query eventExternalTicketSystemPasswordQuery($id: ID!, $childId: ID!) {
    event(id: $id) {
      participantsPerInvite
      ticketSystem {
        ... on TicketmasterEventTicketSystem {
          childPassword(childId: $childId)
          url
        }
        ... on LippupisteEventTicketSystem {
          childPassword(childId: $childId)
          url
        }
        ... on TixlyEventTicketSystem {
          childPassword(childId: $childId)
          url
        }
      }
    }
  }
`;

export const eventExternalTicketSystemHasAnyFreePasswordsQuery = gql`
  query eventExternalTicketSystemHasAnyFreePasswordsQuery($id: ID!) {
    event(id: $id) {
      ticketSystem {
        type
        ... on TicketmasterEventTicketSystem {
          hasAnyFreePasswords
        }
        ... on LippupisteEventTicketSystem {
          hasAnyFreePasswords
        }
        ... on TixlyEventTicketSystem {
          hasAnyFreePasswords
        }
      }
    }
  }
`;

export default eventQuery;
