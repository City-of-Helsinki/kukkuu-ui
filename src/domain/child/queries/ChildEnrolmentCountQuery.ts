import { gql } from '@apollo/client';

export const childEnrolmentCountQuery = gql`
  query ChildEnrolmentCount($childId: ID!) {
    child(id: $childId) {
      id
      pastEnrolmentCount
      project {
        id
        enrolmentLimit
      }
    }
  }
`;
