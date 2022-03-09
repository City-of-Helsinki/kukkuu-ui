import { gql } from '@apollo/client';

const profileQuery = gql`
  query profileQuery {
    myProfile {
      id
      firstName
      lastName
      email
      phoneNumber
      language
      children {
        edges {
          node {
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
            availableEvents {
              edges {
                node {
                  id
                  name
                  duration
                  participantsPerInvite
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
              edges {
                node {
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
              }
            }
          }
        }
      }
      languagesSpokenAtHome {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`;
export default profileQuery;
