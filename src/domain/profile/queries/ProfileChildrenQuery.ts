import { gql } from '@apollo/client';

const profileChildrenQuery = gql`
  query profileChildrenQuery {
    myProfile {
      id
      children {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`;
export default profileChildrenQuery;
