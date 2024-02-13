import { gql } from '@apollo/client';

const requestEmailUpdateTokenMutation = gql`
  mutation RequestEmailUpdateVerificationTokenMutation {
    requestEmailUpdateToken {
      email
      emailUpdateTokenRequested
    }
  }
`;

export default requestEmailUpdateTokenMutation;
