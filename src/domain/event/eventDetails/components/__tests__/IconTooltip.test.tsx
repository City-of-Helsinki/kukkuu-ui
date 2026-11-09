import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customRender as render } from '../../../../../common/test/customRender';
import { IconTooltip } from '../IconTooltip';

describe('IconTooltip', () => {
  it('renders trigger button with accessible label and opens on hover and focus', async () => {
    const user = userEvent.setup();

    render(
      <IconTooltip
        label="Test label"
        icon={<span data-testid="icon">icon</span>}
      >
        <span>Tooltip body content</span>
      </IconTooltip>
    );

    const trigger = screen.getByRole('button', { name: 'Test label' });
    expect(trigger).toBeInTheDocument();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    // Hover opens tooltip
    await user.hover(trigger);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Tooltip body content');

    // Unhover closes tooltip
    await user.unhover(trigger);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    // Tab focuses trigger and opens tooltip
    await user.tab();
    expect(trigger).toHaveFocus();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Tooltip body content');

    // Escape closes tooltip
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('opens on click', async () => {
    const user = userEvent.setup();

    render(
      <IconTooltip
        label="Click test"
        icon={<span>icon</span>}
      >
        <span>Popup</span>
      </IconTooltip>
    );

    const trigger = screen.getByRole('button', { name: 'Click test' });
    await user.click(trigger);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Popup');

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
