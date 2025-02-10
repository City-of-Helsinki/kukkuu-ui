import { screen, fireEvent } from '@testing-library/react';

import { customRender as render } from '../../test/customRender';
import useAriaLive from '../useAriaLive';
import AriaLiveProvider from '../AriaLiveProvider';

const TestUpdater = ({ message }: any) => {
  const { sendMessage } = useAriaLive();

  return (
    <button type="button" onClick={() => sendMessage(message)}>
      SEND
    </button>
  );
};

describe('AriaLive', () => {
  it('should update an aria-live region', async () => {
    const message = 'message';
    const id = 'aria-live-region';
    const dataTestId = 'aria-live-region-testid';

    render(
      <AriaLiveProvider id={id} dataTestId={dataTestId}>
        <TestUpdater message={message} />
      </AriaLiveProvider>
    );

    const ariaLiveRegion = await screen.findByTestId(dataTestId);

    expect(ariaLiveRegion).toMatchInlineSnapshot(`
      <div
        data-testid="aria-live-region-testid"
        id="aria-live-region"
      >
        <div
          aria-live="polite"
          class="_visuallyHidden_936ef7"
        />
      </div>
    `);

    fireEvent.click(screen.getByRole('button', { name: 'SEND' }));

    expect(ariaLiveRegion).toMatchInlineSnapshot(`
      <div
        data-testid="aria-live-region-testid"
        id="aria-live-region"
      >
        <div
          aria-live="polite"
          class="_visuallyHidden_936ef7"
        >
          message
        </div>
      </div>
    `);
  });
});
