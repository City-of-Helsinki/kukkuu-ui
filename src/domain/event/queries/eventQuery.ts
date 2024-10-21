import { gql } from '@apollo/client';

const eventQueryFragments = gql`
  fragment EventOccurrenceFields on OccurrenceNode {
    id
    time
    remainingCapacity
    event {
      id
      name
      duration
    }
    venue {
      id
      name
      address
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
      canChildEnroll(childId: $childId)
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

  ${eventQueryFragments}
`;

export const eventOccurrenceQuery = gql`
  query eventOccurrenceQuery($id: ID!, $childId: ID!) {
    occurrence(id: $id) {
      ...EventOccurrenceFields
    }
  }

  ${eventQueryFragments}
`;

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

export default eventQuery;
