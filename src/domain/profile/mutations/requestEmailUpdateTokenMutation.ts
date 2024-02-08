import { gql } from '@apollo/client';

const requestEmailUpdateTokenMutation = gql`
  mutation RequestEmailUpdateTokenMutation() {
    requestEmailUpdateToken {
      email
      emailUpdateTokenRequested
    }
  }
`;

export default requestEmailUpdateTokenMutation;
