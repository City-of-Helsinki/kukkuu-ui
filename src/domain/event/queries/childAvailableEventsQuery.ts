import { gql } from '@apollo/client';

export const childAvailableEventsQuery = gql`
  query childAvailableEventsQuery($id: ID!) {
    child(id: $id) {
      id
      name
      birthyear
      availableEvents {
        edges {
          node {
            id
            name
            shortDescription
            image
            imageAltText
            duration
            canChildEnroll(childId: $id)
            occurrences(upcoming: true) {
              edges {
                node {
                  id
                  time
                  remainingCapacity
                  occurrenceLanguage
                  venue {
                    id
                    name
                    address
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
