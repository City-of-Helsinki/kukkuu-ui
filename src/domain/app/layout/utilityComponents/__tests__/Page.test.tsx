// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// FIXME: Fix types and re-enable Typescript checking by removing @ts-nocheck
import { screen } from '@testing-library/react';

import {
  render,
  waitFor,
} from '../../../../../common/test/testingLibraryUtils';
import Page from '../Page';

const title = 'Page component';
const defaultProps = { title };
const renderPage = (props: Partial<Parameters<typeof Page>[0]>) =>
  render(<Page {...defaultProps} {...props} />);

describe('<Page />', () => {
  it('should set title', async () => {
    renderPage({});

    await waitFor(() => expect(document.title.length > 0).toEqual(true));
    expect(document.title).toMatchInlineSnapshot(
      `"Page component - Kulttuurin kummilapset"`
    );
  });

  it('should show loading spinner when isLoading is true', () => {
    renderPage({ isLoading: true });

    expect(screen.getByLabelText('Lataa')).toBeTruthy();
  });

  it('should show generic error when error is true', () => {
    renderPage({ isLoading: false, error: true });

    expect(screen.getByText('Tapahtui virhe')).toBeTruthy();
    expect(screen.getByText('Yritä myöhemmin uudestaan')).toBeTruthy();
  });

  it('should show custom error when error is an object', () => {
    const name = 'Error name';
    const description = 'Error description';
    renderPage({
      isLoading: false,
      error: {
        name,
        description,
      },
    });

    expect(screen.getByText(name)).toBeTruthy();
    expect(screen.getByText(description)).toBeTruthy();
  });

  it('should render children when isReady is true', () => {
    renderPage({
      isLoading: false,
      isReady: true,
      children: <div>content</div>,
    });

    expect(screen.getByText('content')).toBeTruthy();
  });
});
