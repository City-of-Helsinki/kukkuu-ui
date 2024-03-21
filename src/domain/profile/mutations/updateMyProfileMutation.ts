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
        hasAcceptedMarketing
      }
    }
  }
`;

export default updateMyProfileMutation;
