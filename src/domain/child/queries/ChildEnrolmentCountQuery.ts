import { gql } from '@apollo/client';

export const childEnrolmentCountQuery = gql`
  query ChildEnrolmentCount($childId: ID!) {
    child(id: $childId) {
      enrolmentCount
      project {
        id
        enrolmentLimit
      }
    }
  }
`;
