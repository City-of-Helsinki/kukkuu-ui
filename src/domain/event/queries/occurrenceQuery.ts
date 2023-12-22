import { gql } from '@apollo/client';

const occurrenceQuery = gql`
  fragment OccurrenceEventFields on EventNode {
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

  fragment OccurrenceVenueFields on VenueNode {
    id
    name
    address
    accessibilityInfo
    arrivalInstructions
    additionalInfo
    wwwUrl
    wcAndFacilities
  }

  fragment OccurrenceFields on OccurrenceNode {
    id
    time
    remainingCapacity
    event {
      ...OccurrenceEventFields
    }
    venue {
      ...OccurrenceVenueFields
    }
    childHasFreeSpotNotificationSubscription(childId: $childId)
  }

  query occurrenceQuery($id: ID!, $childId: ID) {
    occurrence(id: $id) {
      ...OccurrenceFields
    }
  }
`;
export default occurrenceQuery;
