import { gql } from '@apollo/client';

const OccurrenceFragment = gql`
  fragment OccurrenceFragment on OccurrenceNode {
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
        edges {
          node {
            ...OccurrenceFragment
          }
        }
      }
      allOccurrences: occurrences(upcoming: true) {
        edges {
          node {
            ...OccurrenceFragment
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

  ${OccurrenceFragment}
`;

export const eventOccurrenceQuery = gql`
  query eventOccurrenceQuery($id: ID!, $childId: ID!) {
    occurrence(id: $id) {
      ...OccurrenceFragment
    }
  }

  ${OccurrenceFragment}
`;

export default eventQuery;
