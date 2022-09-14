import { gql } from '@apollo/client';

export const childByIdQuery = gql`
  fragment EnrolmentEventFields on EventNode {
    id
    name
    shortDescription
    duration
    image
    imageAltText
    participantsPerInvite
  }
  query childByIdQuery($id: ID!) {
    child(id: $id) {
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
      activeInternalAndTicketSystemEnrolments {
        edges {
          node {
            ... on EnrolmentNode {
              id
              referenceId
              occurrence {
                id
                time
                venue {
                  id
                  name
                  address
                }
                event {
                  ...EnrolmentEventFields
                }
              }
              __typename
            }
            ... on TicketmasterEnrolmentNode {
              id
              event {
                ...EnrolmentEventFields
              }
              __typename
            }
          }
        }
      }
      upcomingEventsAndEventGroups {
        edges {
          node {
            ... on EventNode {
              id
              name
              shortDescription
              image
              imageAltText
              participantsPerInvite
              canChildEnroll(childId: $id)
              __typename
            }
            ... on EventGroupNode {
              id
              name
              shortDescription
              image
              imageAltText
              canChildEnroll(childId: $id)
              __typename
            }
          }
        }
      }
      pastEvents {
        edges {
          node {
            id
            name
            shortDescription
            image
            imageAltText
            participantsPerInvite
            occurrences {
              edges {
                node {
                  id
                  time
                }
              }
            }
          }
        }
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
`;
