import { gql } from '@apollo/client';

const requestEmailUpdateTokenMutation = gql`
  mutation RequestEmailUpdateToken(
    $input: RequestEmailUpdateTokenMutationInput!
  ) {
    requestEmailUpdateToken(input: $input) {
      email
      emailUpdateTokenRequested
    }
  }
`;

export default requestEmailUpdateTokenMutation;
