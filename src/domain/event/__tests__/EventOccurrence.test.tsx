import React from 'react';

import {
  render,
  fireEvent,
  waitFor,
  selectHdsButtonByText,
} from '../../../common/test/testingLibraryUtils';
import initModal from '../../../common/test/initModal';
import { eventQuery_event_occurrences_edges_node as OccurrenceEdgeNode } from '../../api/generatedTypes/eventQuery';
import EventOccurrence from '../EventOccurrence';

const mockedNode: OccurrenceEdgeNode = {
  id: 'T2NjdXJyZW5jZU5vZGU6Mg==',
  time: '2020-03-08T04:00:00+00:00',
  remainingCapacity: 99,
  event: {
    id: 'zzaaz',
    name: 'event name',
  },
  venue: {
    id: 'auppss',
    name: 'Musiikkitalo',
    address: '',
  },
  childHasFreeSpotNotificationSubscription: false,
};
const defaultProps = {
  occurrence: mockedNode,
};

const getWrapper = (props: unknown = {}) =>
  render(
    <table>
      <tbody>
        <EventOccurrence {...defaultProps} {...props} />
      </tbody>
    </table>
  );

it('renders snapshot correctly', () => {
  const { container } = getWrapper({ key: mockedNode.id });

  expect(container).toMatchSnapshot();
});

it('renders button for signing up to an event', () => {
  const { queryByText } = getWrapper();

  expect(queryByText('Valitse')).not.toEqual(null);
});

describe('when event is full', () => {
  const getFullEventWrapper = (
    occurrence: Record<string, unknown> | null = {},
    props: Record<string, unknown> = {}
  ) =>
    getWrapper({
      occurrence: {
        ...mockedNode,
        remainingCapacity: 0,
        ...occurrence,
      },
      ...props,
    });

  it('should show full label instead of remaining capacity', () => {
    const { queryByText } = getFullEventWrapper();

    expect(queryByText('TÄYNNÄ')).not.toEqual(null);
  });

  describe('and child has not subscribed to notifications', () => {
    it('user should be able to subscribe', async () => {
      initModal();

      const render = getFullEventWrapper(null);

      await waitFor(() => {
        fireEvent.click(selectHdsButtonByText(render, 'Tilaa ilmoitus'), {});
      });

      await waitFor(() => {
        // This button is hooked up to Apollo and mocks are not
        // provided, but this test still works.
        expect(render.getAllByText('Tilaa ilmoitus')[0]).toBeDefined();
      });
    });
  });

  describe('and child has subscribed to notifications', () => {
    it('user should be able to unsubscribe', () => {
      const { queryByText } = getFullEventWrapper({
        childHasFreeSpotNotificationSubscription: true,
      });

      expect(queryByText('Peru ilmoituksen tilaus')).not.toEqual(null);
    });
  });
});
