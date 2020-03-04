import gql from 'graphql-tag';

export const addChildMutation = gql`
  mutation addNewChild($input: AddChildMutationInput!) {
    addChild(input: $input) {
      child {
        id
        firstName
        lastName
        birthdate
        postalCode
      }
    }
  }
`;

export const deleteChildMutation = gql`
  mutation deleteChild($input: DeleteChildMutationInput!) {
    deleteChild(input: $input) {
      clientMutationId
    }
  }
`;

export const editChildMutation = gql`
  mutation updateChild($input: UpdateChildMutationInput!) {
    updateChild(input: $input) {
      child {
        id
        firstName
        lastName
        birthdate
        postalCode
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
`;
