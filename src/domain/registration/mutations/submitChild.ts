import { gql } from 'apollo-boost';

const submitChild = gql`
  mutation submitChild(
    $birthdate: Date!
    $firstName: String
    $lastName: String
    $guardianFirstName: String!
    $guardianLastName: String!
    $email: String!
  ) {
    submitChild(
      input: {
        child: {
          birthdate: $birthdate
          firstName: $firstName
          lastName: $lastName
        }
        guardian: {
          lastName: $guardianLastName
          firstName: $guardianFirstName
          email: $email
        }
      }
    ) {
      child {
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

export default submitChild;
