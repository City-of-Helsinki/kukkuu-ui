import { gql } from '@apollo/client';

const eventGroupQuery = gql`
  query eventGroupQuery($id: ID!, $childId: String!) {
    eventGroup(id: $id) {
      id
      name
      shortDescription
      description
      events(availableForChild: $childId) {
        edges {
          node {
            id
            name
            shortDescription
            image
            imageAltText
          }
        }
      }
    }
  }
`;

export default eventGroupQuery;
