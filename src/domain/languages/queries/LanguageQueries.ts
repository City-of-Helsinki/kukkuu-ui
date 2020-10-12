import gql from 'graphql-tag';

export const languagesQuery = gql`
  query languageQuery {
    languages {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
