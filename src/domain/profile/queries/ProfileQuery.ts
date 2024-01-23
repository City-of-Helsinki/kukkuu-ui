import { gql } from '@apollo/client';

const profileQuery = gql`
  fragment MyProfileEnrolmentFields on EnrolmentNode {
    id
    occurrence {
      id
      time
      venue {
        id
        name
      }
      event {
        id
        name
        duration
      }
    }
  }

  fragment MyProfileEnrolmentsFields on EnrolmentNodeConnection {
    edges {
      node {
        ...MyProfileEnrolmentFields
      }
    }
  }

  fragment MyProfileChildProjectFields on ProjectNode {
    id
    name
    year
  }

  fragment MyProfileChildFields on ChildNode {
    id
    name
    birthyear
    postalCode
    project {
      ...MyProfileChildProjectFields
    }
    relationships {
      edges {
        node {
          id
          type
        }
      }
    }
    upcomingEventsAndEventGroups {
      edges {
        node {
          ... on EventGroupNode {
            id
            name
          }
          ... on EventNode {
            id
            name
            duration
            participantsPerInvite
          }
        }
      }
    }
    occurrences {
      edges {
        node {
          id
          event {
            id
            name
            shortDescription
          }
        }
      }
    }
    enrolments {
      ...MyProfileEnrolmentsFields
    }
  }

  fragment MyProfileChildrenFields on ChildNodeConnection {
    edges {
      node {
        ...MyProfileChildFields
      }
    }
  }

  fragment LanguageSpokenAtHomeFields on LanguageNode {
    id
  }

  fragment LanguagesSpokenAtHomeFields on LanguageNodeConnection {
    edges {
      node {
        ...LanguageSpokenAtHomeFields
      }
    }
  }

  fragment MyProfileFields on GuardianNode {
    id
    firstName
    lastName
    email
    phoneNumber
    language
    children {
      ...MyProfileChildrenFields
    }
    languagesSpokenAtHome {
      ...LanguagesSpokenAtHomeFields
    }
  }

  query profileQuery {
    myProfile {
      ...MyProfileFields
    }
  }
`;
export default profileQuery;
