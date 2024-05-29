import { gql } from '@apollo/client';

const updateMyProfileMutation = gql`
  mutation updateMyProfile($input: UpdateMyProfileMutationInput!) {
    updateMyProfile(input: $input) {
      myProfile {
        id
        firstName
        lastName
        language
        email
        hasAcceptedCommunication
      }
    }
  }
`;

export default updateMyProfileMutation;
