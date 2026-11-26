import { gql } from '@apollo/client';

export const occurrenceLanguagesQuery = gql`
  fragment OccurrenceLanguageFields on LanguageNode {
    id
    alpha3Code
    name
  }

  query occurrenceLanguagesQuery {
    languages(canBeOccurrenceLanguage: true) {
      edges {
        node {
          ...OccurrenceLanguageFields
        }
      }
    }
  }
`;
