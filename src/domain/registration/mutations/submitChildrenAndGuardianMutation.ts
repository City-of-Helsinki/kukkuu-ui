import { gql } from 'apollo-boost';

const submitChildrenAndGuardianMutation = gql`
  mutation submitChildrenAndGuardian(
    $children: [ChildInput]
    $guardianFirstName: String!
    $guardianLastName: String!
    $email: String!
  ) {
    submitChildrenAndGuardian(
      input: {
        children: $children
        guardian: {
          lastName: $guardianLastName
          firstName: $guardianFirstName
          email: $email
        }
      }
    ) {
      children {
        birthdate
        firstName
        lastName
      }
      guardian {
        firstName
        lastName
        email
      }
    }
  }
`;

export default submitChildrenAndGuardianMutation;
