import { gql } from '@apollo/client';

const eventGroupQuery = gql`
  fragment EventGroupEventFields on EventNode {
    id
    name
    shortDescription
    image
    imageAltText
    canChildEnroll(childId: $childId)
  }

  fragment EventGroupEventsFields on EventNodeConnection {
    edges {
      node {
        ...EventGroupEventFields
      }
    }
  }

  fragment EventGroupFields on EventGroupNode {
    id
    name
    shortDescription
    description
    events(upcoming: true) {
      ...EventGroupEventsFields
    }
  }

  query eventGroupQuery($id: ID!, $childId: ID!) {
    eventGroup(id: $id) {
      ...EventGroupFields
    }
  }
`;

export default eventGroupQuery;
