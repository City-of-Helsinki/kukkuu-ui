import { gql } from '@apollo/client';

const assignTicketSystemPasswordMutation = gql`
  mutation assignTicketSystemPasswordMutation(
    $input: AssignTicketSystemPasswordMutationInput!
  ) {
    assignTicketSystemPassword(input: $input) {
      password
    }
  }
`;

export default assignTicketSystemPasswordMutation;
