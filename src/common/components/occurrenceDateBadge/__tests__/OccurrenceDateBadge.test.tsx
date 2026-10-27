import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';

import { customRender as render } from '../../../test/customRender';
import OccurrenceDateBadge from '../OccurrenceDateBadge';

describe('OccurrenceDateBadge', () => {
  it('renders date badge with weekday, day, and month', () => {
    render(<OccurrenceDateBadge time="2026-10-04T10:00:00Z" />);

    expect(screen.getByText('SU')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('lokakuu')).toBeInTheDocument();
  });
});
