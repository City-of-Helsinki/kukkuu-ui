// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// FIXME: Fix types and re-enable Typescript checking by removing @ts-nocheck
import { screen } from '@testing-library/react';

import {
  fireEvent,
  render,
  waitFor,
} from '../../../common/test/testingLibraryUtils';
import EventGroup from '../EventGroup';

const defaultProps = {};
const renderEventGroup = (props: Partial<Parameters<typeof EventGroup>[0]>) =>
  render(<EventGroup {...defaultProps} {...props} />);

const event = {
  id: '1',
  name: 'Event name',
  shortDescription: 'Event short description',
  canChildEnroll: true,
};
const eventGroup = {
  name: 'Event group name',
  description: 'Description',
  canChildEnroll: true,
  events: {
    edges: [
      {
        node: event,
      },
    ],
  },
};

describe('<EventGroup />', () => {
  it('renders loading if loading', () => {
    renderEventGroup({ query: { loading: true } });

    expect(screen.getByLabelText('Lataa')).toBeTruthy();
  });

  it('renders error if error', () => {
    renderEventGroup({
      query: { loading: false, error: true },
    });

    expect(screen.getByText('Tapahtui virhe')).toBeTruthy();
  });

  it('renders title and description', () => {
    renderEventGroup({
      query: {
        loading: false,
        data: {
          eventGroup,
        },
      },
    });

    expect(screen.getByText(eventGroup.name)).toBeTruthy();
    expect(screen.getByText(eventGroup.description)).toBeTruthy();
  });

  it('renders events', () => {
    renderEventGroup({
      query: {
        loading: false,
        data: {
          eventGroup,
        },
      },
    });

    expect(screen.getByText(event.name)).toBeTruthy();
    expect(screen.getByText(event.shortDescription)).toBeTruthy();
  });

  it('clicking on event should take user to event', () => {
    renderEventGroup({
      query: {
        loading: false,
        data: {
          eventGroup,
        },
      },
      childId: '123-567',
    });

    fireEvent.click(
      screen.getAllByRole('button', {
        name: 'Lue lisää ja ilmoittaudu',
      })[0]
    );

    expect(window.location.pathname).toMatchInlineSnapshot(
      `"/profile/child/123-567/event/1"`
    );
  });

  it('sets title to name of event group', async () => {
    renderEventGroup({
      query: {
        loading: false,
        data: {
          eventGroup,
        },
      },
    });

    await waitFor(() => expect(document.title).toContain(eventGroup.name));

    expect(document.title).toMatchInlineSnapshot(
      `"Event group name - Kulttuurin kummilapset"`
    );
  });
});
