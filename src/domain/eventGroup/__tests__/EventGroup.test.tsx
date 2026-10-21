// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// FIXME: Fix types and re-enable Typescript checking by removing @ts-nocheck
import { fireEvent, screen, waitFor, within } from '@testing-library/react';

import { customRender as render } from '../../../common/test/customRender';
import { EnrolmentDeniedReason } from '../../api/generatedTypes/graphql';
import EventGroup from '../EventGroup';

const defaultProps = {};
const renderEventGroup = (props: Partial<Parameters<typeof EventGroup>[0]>) =>
  render(<EventGroup {...defaultProps} {...props} />);

const event = {
  id: '1',
  name: 'Event name',
  shortDescription: 'Event short description',
  enrolmentDeniedReason: null,
};
const eventGroup = {
  name: 'Event group name',
  description: 'Description',
  enrolmentDeniedReason: null,
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

  it('tells about registration only on events whose registration is not open', () => {
    const { RegistrationNotOpen, AlreadyJoinedEvent } = EnrolmentDeniedReason;
    const eventEdge = ({
      id,
      name,
      enrolmentDeniedReason,
      registrationOpensAt,
    }) => ({
      node: { ...event, id, name, enrolmentDeniedReason, registrationOpensAt },
    });
    const cardOf = (name) =>
      within(screen.getByRole('button', { name: new RegExp(name) }));

    renderEventGroup({
      query: {
        loading: false,
        data: {
          eventGroup: {
            ...eventGroup,
            events: {
              edges: [
                eventEdge({
                  id: '1',
                  name: 'Opens later',
                  enrolmentDeniedReason: RegistrationNotOpen,
                  registrationOpensAt: '2099-06-01T10:00:00+03:00',
                }),
                eventEdge({
                  id: '2',
                  name: 'No opening time',
                  enrolmentDeniedReason: RegistrationNotOpen,
                  registrationOpensAt: null,
                }),
                eventEdge({
                  id: '3',
                  name: 'Already joined',
                  enrolmentDeniedReason: AlreadyJoinedEvent,
                  registrationOpensAt: '2020-01-01T10:00:00+03:00',
                }),
              ],
            },
          },
        },
      },
    });

    expect(
      cardOf('Opens later').getByText(
        'Ilmoittautuminen alkaa 1.6.2099 klo 10:00'
      )
    ).toBeInTheDocument();
    expect(
      cardOf('No opening time').getByText(
        'Ilmoittautuminen ei ole vielä alkanut'
      )
    ).toBeInTheDocument();
    expect(
      cardOf('Already joined').queryByText(/ilmoittautuminen/i)
    ).not.toBeInTheDocument();
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

    expect(globalThis.window.location.pathname).toMatchInlineSnapshot(
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
