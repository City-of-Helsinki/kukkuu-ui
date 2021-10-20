import { gql } from '@apollo/client';

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
