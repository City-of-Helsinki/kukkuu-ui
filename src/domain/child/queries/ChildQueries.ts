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

  fragment PastEventOccurrenceFields on OccurrenceNode {
    id
    time
  }

  fragment PastEventOccurrencesFields on OccurrenceNodeConnection {
    edges {
      node {
        ...PastEventOccurrenceFields
      }
    }
  }

  fragment PastEventFields on EventNode {
    id
    name
    shortDescription
    image
    imageAltText
    participantsPerInvite
    occurrences {
      ...PastEventOccurrencesFields
    }
  }

  fragment PastEventsFields on EventConnection {
    edges {
      node {
        ...PastEventFields
      }
    }
  }

  fragment EnrolmentVenueFields on VenueNode {
    id
    name
    address
  }

  fragment EnrolmentOccurrenceFields on OccurrenceNode {
    id
    time
    venue {
      ...EnrolmentVenueFields
    }
    event {
      ...EnrolmentEventFields
    }
  }

  fragment ActiveInternalEnrolmentFields on EnrolmentNode {
    id
    referenceId
    occurrence {
      ...EnrolmentOccurrenceFields
    }
    __typename
  }

  fragment ActiveTicketmasterEnrolmentFields on TicketmasterEnrolmentNode {
    id
    event {
      ...EnrolmentEventFields
    }
    __typename
  }

  fragment ActiveLippupisteEnrolmentFields on LippupisteEnrolmentNode {
    id
    event {
      ...EnrolmentEventFields
    }
    __typename
  }

  fragment ActiveInternalAndTicketSystemEnrolmentsFields on InternalOrTicketSystemEnrolmentConnection {
    edges {
      node {
        ... on EnrolmentNode {
          ...ActiveInternalEnrolmentFields
        }
        ... on TicketmasterEnrolmentNode {
          ...ActiveTicketmasterEnrolmentFields
        }
        ... on LippupisteEnrolmentNode {
          ...ActiveLippupisteEnrolmentFields
        }
      }
    }
  }

  fragment UpcomingEventFields on EventNode {
    id
    name
    shortDescription
    image
    imageAltText
    participantsPerInvite
    canChildEnroll(childId: $id)
    __typename
  }

  fragment UpcomingEventGroupFields on EventGroupNode {
    id
    name
    shortDescription
    image
    imageAltText
    canChildEnroll(childId: $id)
    __typename
  }

  fragment UpcomingEventsAndEventGroupsFields on EventOrEventGroupConnection {
    edges {
      node {
        ... on EventNode {
          ...UpcomingEventFields
        }
        ... on EventGroupNode {
          ...UpcomingEventGroupFields
        }
      }
    }
  }

  fragment RelationshipFields on RelationshipNode {
    id
    type
  }

  fragment RelationshipsFields on RelationshipNodeConnection {
    edges {
      node {
        ...RelationshipFields
      }
    }
  }

  fragment ChildByIdQueryProjectFields on ProjectNode {
    id
    name
    year
  }

  fragment ChildByIdQueryFields on ChildNode {
    id
    firstName
    lastName
    birthdate
    postalCode
    project {
      ...ChildByIdQueryProjectFields
    }
    activeInternalAndTicketSystemEnrolments {
      ...ActiveInternalAndTicketSystemEnrolmentsFields
    }
    upcomingEventsAndEventGroups {
      ...UpcomingEventsAndEventGroupsFields
    }
    pastEvents {
      ...PastEventsFields
    }
    relationships {
      ...RelationshipsFields
    }
  }

  query childByIdQuery($id: ID!) {
    child(id: $id) {
      ...ChildByIdQueryFields
    }
  }
`;
