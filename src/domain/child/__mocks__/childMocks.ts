import { MockedResponse } from '@apollo/client/testing';

import { childByIdQuery, childNotesByIdQuery } from '../queries/ChildQueries';
import { ChildEnrolmentCountDocument } from '../../api/generatedTypes/graphql';

export const testChildId = 'child-123';

export const childData = {
  __typename: 'ChildNode' as const,
  id: testChildId,
  name: 'Test Child',
  birthyear: 2020,
  postalCode: '00100',
  project: {
    __typename: 'ProjectNode' as const,
    id: 'project-1',
    name: 'Test Project',
    year: 2024,
  },
  activeInternalAndTicketSystemEnrolments: {
    __typename: 'InternalOrTicketSystemEnrolmentConnection' as const,
    edges: [],
  },
  upcomingEventsAndEventGroups: {
    __typename: 'EventOrEventGroupConnection' as const,
    edges: [],
  },
  pastEvents: {
    __typename: 'EventConnection' as const,
    edges: [],
  },
  relationships: {
    __typename: 'RelationshipNodeConnection' as const,
    edges: [],
  },
};

export const childByIdMock: MockedResponse = {
  request: {
    query: childByIdQuery,
    variables: { id: testChildId },
  },
  result: {
    data: { child: childData },
  },
};

export const enrolmentCountMock: MockedResponse = {
  request: {
    query: ChildEnrolmentCountDocument,
    variables: { childId: testChildId },
  },
  result: {
    data: {
      child: {
        id: testChildId,
        enrolmentCount: 1,
        pastEnrolmentCount: 0,
        project: { id: 'project-1', enrolmentLimit: 2 },
      },
    },
  },
};

export const childNotesMock: MockedResponse = {
  request: {
    query: childNotesByIdQuery,
    variables: { id: testChildId },
  },
  result: {
    data: {
      childNotes: {
        __typename: 'ChildNotesNode',
        childId: testChildId,
        notes: '',
      },
    },
  },
};
