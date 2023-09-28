import {
  render,
  fireEvent,
  waitFor,
  selectHdsButtonByText,
} from '../../../../common/test/testingLibraryUtils';
import initModal from '../../../../common/test/initModal';
import Enrol from '../Enrol';

const occurrence = {
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
  childId: '123',
  isSubscriptionModalOpen: false,
  occurrence,
  onCancel: vi.fn(),
  onEnrol: vi.fn(),
  onUnsubscribe: vi.fn(),
  onSubscribe: vi.fn(),
  onSubscribed: vi.fn(),
  setIsSubscriptionModalOpen: vi.fn(),
};

const getWrapper = (props?: unknown) =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  render(<Enrol {...defaultProps} {...props} />);

describe('<Enrol />', () => {
  it('the user should be able to sign in to an event', async () => {
    const onEnrol = vi.fn();
    const render = getWrapper({ onEnrol });
    const signUpButton = selectHdsButtonByText(
      render,
      'Ilmoittaudu tapahtumaan'
    );

    fireEvent.click(signUpButton, {});

    expect(onEnrol).toHaveBeenCalled();
  });

  it('the user should be able to cancel', () => {
    const onCancel = vi.fn();
    const render = getWrapper({ onCancel });
    const cancelButton = selectHdsButtonByText(
      render,
      'Takaisin tapahtuman valintaan'
    );

    fireEvent.click(cancelButton, {});

    expect(onCancel).toHaveBeenCalled();
  });

  describe('when the event is full', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getFullOccurrenceWrapper = (props: any = {}) =>
      getWrapper({
        occurrence: {
          ...occurrence,
          remainingCapacity: 0,
        },
        ...props,
      });

    it('the user should be able to subscribe to notifications', async () => {
      initModal();

      const onSubscribe = vi.fn();
      const onSubscribed = vi.fn();
      const render = getFullOccurrenceWrapper({
        onSubscribe,
        onSubscribed,
      });

      await waitFor(() => {
        fireEvent.click(
          selectHdsButtonByText(render, 'Täynnä - Tilaa ilmoitus'),
          {}
        );
      });

      expect(onSubscribe).toHaveBeenCalled();

      await waitFor(() => {
        // This button is hooked up to Apollo and mocks are not
        // provided, but this test still works.
        fireEvent.click(selectHdsButtonByText(render, 'Tilaa ilmoitus'));
      });

      // onSubscribed is called after a successful subscription
      expect(onSubscribed).toHaveBeenCalled();
    });

    it('should have a special title and description', () => {
      const { queryByText } = getFullOccurrenceWrapper();

      expect(
        queryByText('Ilmottautumien tapahtumaan event name epäonnistui')
      ).not.toEqual(null);
      expect(
        queryByText(
          // eslint-disable-next-line max-len
          'Valitettavasti tämä tapahtuma on täynnä. Tilaa ilmoitus vapautuvista paikoista.'
        )
      ).not.toEqual(null);
    });
  });

  describe('when the event is full and te user has subscribed', () => {
    it('the user should be able to unsubscribe', async () => {
      const onUnsubscribed = vi.fn();
      const render = getWrapper({
        onUnsubscribed,
        occurrence: {
          ...occurrence,
          remainingCapacity: 0,
          childHasFreeSpotNotificationSubscription: true,
        },
      });
      const subscribeButton = selectHdsButtonByText(
        render,
        'Peru ilmoituksen tilaus'
      );

      await waitFor(() => {
        fireEvent.click(subscribeButton, {});
      });

      expect(onUnsubscribed).toHaveBeenCalled();
    });
  });
});
