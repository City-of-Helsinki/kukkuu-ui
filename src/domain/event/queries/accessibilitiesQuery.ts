import { gql } from '@apollo/client';

export const accessibilitiesQuery = gql`
  fragment AccessibilityFields on AccessibilityNode {
    id
    slug
    name
    description
    sortOrder
  }

  query accessibilitiesQuery {
    accessibilities {
      edges {
        node {
          ...AccessibilityFields
        }
      }
    }
  }
`;
