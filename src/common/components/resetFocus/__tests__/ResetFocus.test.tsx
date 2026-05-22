import { render, waitFor } from '@testing-library/react';

import ResetFocus from '../ResetFocus';
import { RESET_FOCUS_ID } from '../constants';

describe('ResetFocus', () => {
  it('focuses the reset focus element on mount', async () => {
    render(<ResetFocus />);

    const resetFocusElement = document.getElementById(RESET_FOCUS_ID);
    expect(resetFocusElement).toBeTruthy();

    await waitFor(() => {
      expect(resetFocusElement).toHaveFocus();
    });
  });
});
