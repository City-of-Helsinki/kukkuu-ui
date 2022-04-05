import { gql } from '@apollo/client';

export const childEventInvitationLabelQuery = gql`
  query ChildEventInvitationLabelQuery($childId: ID!) {
    child(id: $childId) {
      id
      upcomingEventsAndEventGroups {
        edges {
          node {
            ... on EventGroupNode {
              id
              canChildEnroll(childId: $childId)
            }
            ... on EventNode {
              id
              canChildEnroll(childId: $childId)
            }
          }
        }
      }
    }
  }
`;
