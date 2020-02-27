import gql from 'graphql-tag';

export const childrenQuery = gql`
  query ChildrenQuery {
    children {
      edges {
        node {
          id
          createdAt
          updatedAt
          firstName
          lastName
          birthdate
          postalCode
          guardians {
            edges {
              node {
                id
              }
            }
          }
          relationships {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
`;

export const childByIdQuery = gql`
  query childByIdQuery($id: ID!) {
    child(id: $id) {
      id
      firstName
      lastName
      birthdate
      postalCode
      occurrences {
        edges {
          node {
            event {
              id
              translations {
                name
                shortDescription
              }
            }
          }
        }
      }
      availableEvents {
        edges {
          node {
            id
            translations {
              name
              shortDescription
            }
            image
          }
        }
      }
      enrolments {
        edges {
          node {
            occurrence {
              time
              venue {
                name
              }
              event {
                id
                translations {
                  name
                  shortDescription
                }
                image
              }
            }
          }
        }
      }
      pastEvents {
        edges {
          node {
            id
            translations {
              name
              shortDescription
            }
            image
          }
        }
      }
      relationships {
        edges {
          node {
            type
          }
        }
      }
    }
  }
`;
