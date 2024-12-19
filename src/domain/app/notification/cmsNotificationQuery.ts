import { gql } from '@apollo/client';

export const cmsNotificationQuery = gql`
  query notification($language: String! = "fi") {
    notification(language: $language) {
      content
      title
      level
      startDate
      endDate
      linkText
      linkUrl
    }
  }
`;

export default cmsNotificationQuery;
