import { waitFor } from '@testing-library/react';

import { customRender as render } from '../../../common/test/customRender';
import CookieConsentPage from '../CookieConsentPage';

it('renders snapshot correctly', async () => {
  const { container } = render(<CookieConsentPage />);
  await waitFor(() => {
    expect(
      container.querySelector('#hds-cookie-consent-full-page')
    ).toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();
});

it('shows translated notification after saving settings', async () => {
  // Mock indexedDB for jsdom environment
  const originalIndexedDB = globalThis.indexedDB;
  // @ts-expect-error partial mock for jsdom
  globalThis.indexedDB = {
    databases: vi.fn().mockResolvedValue([]),
  };

  try {
    const { container } = render(<CookieConsentPage />);
    await waitFor(() => {
      expect(
        container.querySelector('.hds-cc__target')?.shadowRoot
      ).toBeTruthy();
    });

    const shadowRoot = container.querySelector('.hds-cc__target')?.shadowRoot;
    const saveButton = shadowRoot?.querySelector<HTMLButtonElement>(
      '.hds-cc__required-cookies-button'
    );
    expect(saveButton).toBeInTheDocument();
    saveButton?.click();

    await waitFor(() => {
      const notification = shadowRoot?.querySelector(
        '#hds-cc-aria-live .hds-notification'
      );
      expect(notification).toBeInTheDocument();
      expect(notification).toHaveTextContent('Asetukset tallennettu');
      expect(notification).toHaveAttribute('aria-label', 'Ilmoitus');
    });
  } finally {
    globalThis.indexedDB = originalIndexedDB;
  }
});
