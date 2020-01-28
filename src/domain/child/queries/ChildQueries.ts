import gql from 'graphql-tag';

const childrenQuery = gql`
  query ChildrenQuery {
    children {
      edges {
        node {
          id
          createdAt
          updatedAt
          firstName
          lastName
          birthdate
          postalCode
          guardians {
            edges {
              node {
                id
              }
            }
          }
          relationships {
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
export default childrenQuery;
