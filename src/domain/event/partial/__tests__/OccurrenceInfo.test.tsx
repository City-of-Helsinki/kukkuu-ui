import React from 'react';

import OccurrenceInfo from '../OccurrenceInfo';
import { mockedOccurrenceNode } from '../../__tests__/EventPage.test';
import {
  ChildByIdQuery,
  EventParticipantsPerInvite,
} from '../../../api/generatedTypes/graphql';
import { render } from '../../../../common/test/testingLibraryUtils';
import { TypeByTypename } from '../../../../common/commonUtils';

type ChildByIdQueryEnrolmentNodeOccurrence = NonNullable<
  TypeByTypename<
    NonNullable<
      NonNullable<
        NonNullable<
          ChildByIdQuery['child']
        >['activeInternalAndTicketSystemEnrolments']
      >['edges'][number]
    >['node'],
    'EnrolmentNode'
  >['occurrence']
>;

const mockOccurrence: ChildByIdQueryEnrolmentNodeOccurrence = {
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
