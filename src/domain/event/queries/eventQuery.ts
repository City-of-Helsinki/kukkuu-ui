import gql from 'graphql-tag';

// TODO: Add remainingCapacity to occurrences when backend bug is fixed
const eventQuery = gql`
  query eventQuery($id: ID!) {
    event(id: $id) {
      id
      name
      description
      shortDescription
      image
      participantsPerInvite
      duration
      capacityPerOccurrence
      occurrences {
        edges {
          node {
            id
            time
            venue {
              name
              description
              address
            }
          }
        }
      }
    }
  }
`;
export default eventQuery;
