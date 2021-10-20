import { gql } from '@apollo/client';

export const addChildMutation = gql`
  mutation addNewChild($input: AddChildMutationInput!) {
    addChild(input: $input) {
      child {
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
`;
