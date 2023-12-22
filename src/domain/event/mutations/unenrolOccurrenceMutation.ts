import { gql } from '@apollo/client';

const unenrolOccurrenceMutation = gql`
  fragment UnenrolOccurrencesFields on OccurrenceNodeConnection {
    edges {
      node {
        id
        time
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
  }

  fragment UnenrolOccurrenceMutationPayloadFields on UnenrolOccurrenceMutationPayload {
    clientMutationId
    occurrence {
      id
      event {
        id
      }
    }
    child {
      id
      availableEvents {
        edges {
          node {
            id
          }
        }
      }
      occurrences(upcomingWithOngoing: true) {
        ...UnenrolOccurrencesFields
      }
      pastEvents {
        edges {
          node {
            id
          }
        }
      }
    }
  }

  mutation unenrolOccurrenceMutation($input: UnenrolOccurrenceMutationInput!) {
    unenrolOccurrence(input: $input) {
      ...UnenrolOccurrenceMutationPayloadFields
    }
  }
`;

export default unenrolOccurrenceMutation;
