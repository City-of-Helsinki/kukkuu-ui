import gql from 'graphql-tag';

const addChildMutation = gql`
  mutation addNewChild($input: AddChildMutationInput!) {
    addChild(input: $input) {
      child {
        firstName
        lastName
        birthdate
        postalCode
      }
    }
  }
`;

export default addChildMutation;
