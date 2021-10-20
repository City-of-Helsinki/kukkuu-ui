import { render, screen, fireEvent } from '../../test/testingLibraryUtils';
import useAriaLive from '../useAriaLive';
import AriaLiveProvider from '../AriaLiveProvider';

const TestUpdater = ({ message }) => {
  const { sendMessage } = useAriaLive();

  return (
    <button type="button" onClick={() => sendMessage(message)}>
      SEND
    </button>
  );
};

describe('AriaLive', () => {
  it('should update an aria-live region', () => {
    const message = 'message';
    const id = 'aria-live-region';

    render(
      <AriaLiveProvider id={id}>
        <TestUpdater message={message} />
      </AriaLiveProvider>
    );

    expect(document.getElementById(id)).toBeInTheDocument();
    expect(document.getElementById(id)).toMatchInlineSnapshot(`
      <div
        id="aria-live-region"
      >
        <div
          aria-live="polite"
          class="visuallyHidden"
        />
      </div>
    `);

    fireEvent.click(screen.getByRole('button', { name: 'SEND' }));

    expect(document.getElementById(id)).toMatchInlineSnapshot(`
      <div
        id="aria-live-region"
      >
        <div
          aria-live="polite"
          class="visuallyHidden"
        >
          message
        </div>
      </div>
    `);
  });
});
