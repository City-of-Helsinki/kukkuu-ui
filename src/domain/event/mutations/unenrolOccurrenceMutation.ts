import { gql } from '@apollo/client';

const unenrolOccurrenceMutation = gql`
  mutation unenrolOccurrenceMutation($input: UnenrolOccurrenceMutationInput!) {
    unenrolOccurrence(input: $input) {
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
        occurrences(upcomingWithLeeway: true) {
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
        pastEvents {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
`;

export default unenrolOccurrenceMutation;
