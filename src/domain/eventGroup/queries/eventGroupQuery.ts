import { gql } from '@apollo/client';

const eventGroupQuery = gql`
  query eventGroupQuery($id: ID!) {
    eventGroup(id: $id) {
      id
      name
      shortDescription
      description
      events {
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
