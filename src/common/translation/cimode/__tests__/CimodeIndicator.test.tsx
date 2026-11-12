import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customRender as render } from '../../../test/customRender';
import CimodeIndicator from '../CimodeIndicator';
import {
  setCimodeActive,
  isCimodeActive,
  setCimodeIndicatorRequested,
  isCimodeIndicatorRequested,
} from '../cimodeUtils';

describe('CimodeIndicator', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    setCimodeActive(false);
    setCimodeIndicatorRequested(false);
  });

  it('does not render when indicator was not requested and CIMODE is inactive', () => {
    render(<CimodeIndicator />);
    expect(screen.queryByTestId('cimode-indicator')).toBeNull();
  });

  it('renders indicator with translation keys note when CIMODE is active', () => {
    setCimodeActive(true);
    render(<CimodeIndicator />);

    expect(screen.getByTestId('cimode-indicator')).toBeInTheDocument();
    expect(screen.getByText('CIMODE')).toBeInTheDocument();
    expect(screen.getByText('Showing translation keys')).toBeInTheDocument();
    expect(screen.getByTestId('cimode-toggle-button')).toHaveTextContent(
      'Disable'
    );
    expect(screen.getByTestId('cimode-close-button')).toBeInTheDocument();
  });

  it('renders indicator with normal text when indicator is requested and CIMODE is inactive', () => {
    setCimodeIndicatorRequested(true);
    render(<CimodeIndicator />);

    expect(screen.getByTestId('cimode-indicator')).toBeInTheDocument();
    expect(screen.getByText('CIMODE')).toBeInTheDocument();
    expect(screen.getByText('Normal translations')).toBeInTheDocument();
    expect(screen.getByTestId('cimode-toggle-button')).toHaveTextContent(
      'Enable'
    );
  });

  it('toggles CIMODE state when toggle button is clicked', async () => {
    const user = userEvent.setup();
    setCimodeActive(true);
    render(<CimodeIndicator />);

    const toggleButton = screen.getByTestId('cimode-toggle-button');
    expect(toggleButton).toHaveTextContent('Disable');

    // Turn off CIMODE -> renders inactive English text
    await user.click(toggleButton);
    expect(isCimodeActive()).toBe(false);
    expect(toggleButton).toHaveTextContent('Enable');
    expect(screen.getByText('Normal translations')).toBeInTheDocument();

    // Turn on CIMODE -> renders active English text
    await user.click(toggleButton);
    expect(isCimodeActive()).toBe(true);
    expect(toggleButton).toHaveTextContent('Disable');
    expect(screen.getByText('Showing translation keys')).toBeInTheDocument();
  });

  it('closes indicator when close button is clicked', async () => {
    const user = userEvent.setup();
    setCimodeActive(true);
    render(<CimodeIndicator />);

    const closeButton = screen.getByTestId('cimode-close-button');
    await user.click(closeButton);

    expect(isCimodeIndicatorRequested()).toBe(false);
    expect(isCimodeActive()).toBe(false);
    expect(screen.queryByTestId('cimode-indicator')).toBeNull();
  });
});
