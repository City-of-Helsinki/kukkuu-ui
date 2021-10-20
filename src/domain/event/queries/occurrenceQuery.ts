import { gql } from '@apollo/client';

const occurrenceQuery = gql`
  query occurrenceQuery($id: ID!, $childId: ID) {
    occurrence(id: $id) {
      id
      time
      remainingCapacity
      event {
        id
        image
        imageAltText
        description
        shortDescription
        name
        duration
        participantsPerInvite
        eventGroup {
          id
        }
      }
      venue {
        id
        name
        address
        accessibilityInfo
        arrivalInstructions
        additionalInfo
        wwwUrl
        wcAndFacilities
      }
      childHasFreeSpotNotificationSubscription(childId: $childId)
    }
  }
`;
export default occurrenceQuery;
