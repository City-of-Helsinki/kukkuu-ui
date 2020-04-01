import gql from 'graphql-tag';

const occurrenceQuery = gql`
  query occurrenceQuery($id: ID!) {
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
    }
  }
`;
export default occurrenceQuery;
