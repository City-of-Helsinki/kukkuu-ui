import { gql } from '@apollo/client';

export const themePathsQuery = gql`
  fragment ThemePathFields on ThemePathNode {
    id
    slug
    name
  }

  query themePathsQuery {
    themePaths {
      edges {
        node {
          ...ThemePathFields
        }
      }
    }
  }
`;
