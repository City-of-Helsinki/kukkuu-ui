import { gql } from '@apollo/client';

export const childByIdQuery = gql`
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
                  id
                  name
                  shortDescription
                  duration
                  image
                  imageAltText
                  participantsPerInvite
                }
              }
            }
            ... on TicketmasterEnrolmentNode {
              id
              event {
                id
                name
                shortDescription
                duration
                image
                imageAltText
                participantsPerInvite
              }
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
            }
            ... on EventGroupNode {
              id
              name
              shortDescription
              image
              imageAltText
              canChildEnroll(childId: $id)
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
