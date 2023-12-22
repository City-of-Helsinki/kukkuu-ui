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
  fragment DeleteChildMutationPayloadFields on DeleteChildMutationPayload {
    clientMutationId
  }

  mutation deleteChild($input: DeleteChildMutationInput!) {
    deleteChild(input: $input) {
      ...DeleteChildMutationPayloadFields
    }
  }
`;

export const editChildMutation = gql`
  fragment UpdateChildMutationPayloadFields on UpdateChildMutationPayload {
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

  mutation updateChild($input: UpdateChildMutationInput!) {
    updateChild(input: $input) {
      ...UpdateChildMutationPayloadFields
    }
  }
`;
