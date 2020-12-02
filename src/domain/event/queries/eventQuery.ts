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
  }
`;

const eventQuery = gql`
  query eventQuery($id: ID!, $date: Date, $time: Time, $childId: ID) {
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
    }
  }

  ${OccurrenceFragment}
`;
export default eventQuery;
