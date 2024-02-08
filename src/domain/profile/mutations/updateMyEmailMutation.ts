import { gql } from '@apollo/client';

const updateMyEmailMutation = gql`
  mutation UpdateMyEmailMutation($input: UpdateMyEmailMutationInput!) {
    updateMyEmail(input: $input) {
      myProfile {
        id
        firstName
        lastName
        language
        email
      }
    }
  }
`;

export default updateMyEmailMutation;
