import { gql } from '@apollo/client';

const updateMyMarketingSubscriptionsMutation = gql`
  mutation UpdateMyMarketingSubscriptions(
    $input: UpdateMyMarketingSubscriptionsMutationInput!
  ) {
    updateMyMarketingSubscriptions(input: $input) {
      guardian {
        firstName
        lastName
        language
        hasAcceptedMarketing
      }
    }
  }
`;

export default updateMyMarketingSubscriptionsMutation;
