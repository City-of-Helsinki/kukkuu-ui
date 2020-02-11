import gql from 'graphql-tag';

const updateMyProfileMutation = gql`
  mutation updateMyProfile($input: UpdateMyProfileMutationInput!) {
    updateMyProfile(input: $input) {
      myProfile {
        firstName
        lastName
        language
        email
      }
    }
  }
`;

export default updateMyProfileMutation;
