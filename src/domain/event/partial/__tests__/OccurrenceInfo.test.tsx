import React from 'react';

import OccurrenceInfo from '../OccurrenceInfo';
import { mockedOccurrenceNode } from '../../__tests__/EventPage.test';
import { EventParticipantsPerInvite } from '../../../api/generatedTypes/graphql';
import { customRender as render } from '../../../../common/test/customRender';
import { InternalEnrolmentOccurrence } from '../../../child/types/ChildByIdQueryTypes';

const mockOccurrence: InternalEnrolmentOccurrence = {
  id: 'aa',
  time: '2020-03-08T04:00:00+00:00',
  event: {
    id: 'zzaaz',
    name: 'event name',
    image: 'a',
    imageAltText: 'b',
    shortDescription: 'd',
    duration: 12,
    participantsPerInvite: EventParticipantsPerInvite.Family,
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
