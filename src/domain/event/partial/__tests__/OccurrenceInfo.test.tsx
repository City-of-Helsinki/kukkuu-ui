import React from 'react';

import OccurrenceInfo from '../OccurrenceInfo';
import { mockedOccurrenceNode } from '../../__tests__/EventPage.test';
// eslint-disable-next-line max-len
import { childByIdQuery_child_activeInternalAndTicketSystemEnrolments_edges_node_EnrolmentNode_occurrence as OccurrenceNode } from '../../../api/generatedTypes/childByIdQuery';
import { EventParticipantsPerInvite } from '../../../api/generatedTypes/globalTypes';
import { render } from '../../../../common/test/testingLibraryUtils';

const mockOccurrence: OccurrenceNode = {
  id: 'aa',
  time: '2020-03-08T04:00:00+00:00',
  event: {
    id: 'zzaaz',
    name: 'event name',
    image: 'a',
    imageAltText: 'b',
    shortDescription: 'd',
    duration: 12,
    participantsPerInvite: EventParticipantsPerInvite.FAMILY,
  },
  venue: {
    id: 'auppss',
    name: 'Musiikkitalo',
    address: 'Urho Kekkosen katu 12',
  },
};

it('renders occurrence snapshot correctly', () => {
  const { container } = render(
    <OccurrenceInfo occurrence={mockedOccurrenceNode} />
  );
  expect(container).toMatchSnapshot();
});

it('renders childByIdQuery occurrence snapshot correctly', () => {
  const { container } = render(<OccurrenceInfo occurrence={mockOccurrence} />);
  expect(container).toMatchSnapshot();
});
