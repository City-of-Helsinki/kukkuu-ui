import { gql } from '@apollo/client';

export const languagesQuery = gql`
  fragment LanguageFields on LanguageNode {
    id
    name
  }

  fragment LanguagesFields on LanguageNodeConnection {
    edges {
      node {
        ...LanguageFields
      }
    }
  }

  query languageQuery {
    languages {
      ...LanguagesFields
    }
  }
`;
