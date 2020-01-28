import gql from 'graphql-tag';

const guardiansQuery = gql`
  query GuardiansQuery {
    guardians {
      edges {
        node {
          id
          createdAt
          updatedAt
          firstName
          lastName
          phoneNumber
          language
          children {
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
          email
        }
      }
    }
  }
`;
export default guardiansQuery;
