import { gql } from '@apollo/client';

const eventGroupQuery = gql`
  query eventGroupQuery($id: ID!, $childId: ID!) {
    eventGroup(id: $id) {
      id
      name
      shortDescription
      description
      events(upcoming: true) {
        edges {
          node {
            id
            name
            shortDescription
            image
            imageAltText
            canChildEnroll(childId: $childId)
          }
        }
      }
    }
  }
`;

export default eventGroupQuery;
