import { gql } from '@apollo/client';

const enrolOccurrenceMutation = gql`
  fragment EnrolOccurrencesFields on OccurrenceNodeConnection {
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

  fragment EnrolOccurrenceMutationPayloadFields on EnrolOccurrenceMutationPayload {
    clientMutationId
    enrolment {
      id
      occurrence {
        id
        event {
          id
        }
        venue {
          id
        }
      }
      child {
        id
        occurrences(upcoming: true) {
          ...EnrolOccurrencesFields
        }
        pastEvents {
          edges {
            node {
              id
            }
          }
        }
        availableEvents {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }

  mutation enrolOccurrenceMutation($input: EnrolOccurrenceMutationInput!) {
    enrolOccurrence(input: $input) {
      ...EnrolOccurrenceMutationPayloadFields
    }
  }
`;

export default enrolOccurrenceMutation;
