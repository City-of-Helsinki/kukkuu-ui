import { gql } from '@apollo/client';

const submitChildrenAndGuardianMutation = gql`
  fragment SubmitGuardianFields on GuardianNode {
    id
    firstName
    lastName
    email
    phoneNumber
    language
    children {
      edges {
        node {
          id
          firstName
          lastName
          birthdate
          postalCode
          project {
            id
            name
            year
          }
          relationships {
            edges {
              node {
                id
                type
              }
            }
          }
        }
      }
    }
  }

  fragment SubmitChildrenAndGuardianMutationPayloadFields on SubmitChildrenAndGuardianMutationPayload {
    guardian {
      ...SubmitGuardianFields
    }
  }

  mutation submitChildrenAndGuardian(
    $children: [ChildInput!]!
    $guardian: GuardianInput!
  ) {
    submitChildrenAndGuardian(
      input: { children: $children, guardian: $guardian }
    ) {
      ...SubmitChildrenAndGuardianMutationPayloadFields
    }
  }
`;

export default submitChildrenAndGuardianMutation;
