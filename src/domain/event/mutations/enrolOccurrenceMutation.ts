import { gql } from '@apollo/client';

const enrolOccurrenceMutation = gql`
  mutation enrolOccurrenceMutation($input: EnrolOccurrenceMutationInput!) {
    enrolOccurrence(input: $input) {
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
  }
`;

export default enrolOccurrenceMutation;
