import {
  fireEvent,
  render,
  waitFor,
} from '../../../common/test/testingLibraryUtils';
import EventGroup from '../EventGroup';

const defaultProps = {};
const getWrapper = (props) =>
  render(<EventGroup {...defaultProps} {...props} />);

const event = {
  id: '1',
  name: 'Event name',
  shortDescription: 'Event short description',
};
const eventGroup = {
  name: 'Event group name',
  description: 'Description',
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
    const { getByLabelText } = getWrapper({ query: { loading: true } });

    expect(getByLabelText('Lataa')).toBeTruthy();
  });

  it('renders error if error', () => {
    const { getByText } = getWrapper({
      query: { loading: false, error: true },
    });

    expect(getByText('Tapahtui virhe')).toBeTruthy();
  });

  it('renders title and description', () => {
    const { getByText } = getWrapper({
      query: {
        loading: false,
        data: {
          eventGroup,
        },
      },
    });

    expect(getByText(eventGroup.name)).toBeTruthy();
    expect(getByText(eventGroup.description)).toBeTruthy();
  });

  it('renders events', () => {
    const { getByText } = getWrapper({
      query: {
        loading: false,
        data: {
          eventGroup,
        },
      },
    });

    expect(getByText(event.name)).toBeTruthy();
    expect(getByText(event.shortDescription)).toBeTruthy();
  });

  it('clicking on event should take user to event', () => {
    const { getAllByRole } = getWrapper({
      query: {
        loading: false,
        data: {
          eventGroup,
        },
      },
      childId: '123-567',
    });

    fireEvent.click(
      getAllByRole('button', {
        name: 'Lue lisää ja ilmoittaudu tapahtumaan',
      })[0]
    );

    expect(window.location.pathname).toMatchInlineSnapshot(
      `"/profile/child/123-567/event/1"`
    );
  });

  it('sets title to name of event group', async () => {
    getWrapper({
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
