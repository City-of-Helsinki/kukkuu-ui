import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';

import { customRender as render } from '../../../../../common/test/customRender';
import { OccurrenceStatus } from '../../occurrenceStatus';
import { OccurrenceStatusBadge } from '../OccurrenceStatusBadge';

describe('OccurrenceStatusBadge', () => {
  it('renders enrolled badge when status is enrolled', () => {
    render(<OccurrenceStatusBadge status={OccurrenceStatus.Enrolled} />);
    expect(screen.getByText('Ilmoittautunut')).toBeInTheDocument();
  });

  it('renders full badge with alert icon when status is full', () => {
    render(<OccurrenceStatusBadge status={OccurrenceStatus.Full} />);
    expect(screen.getByText('Täynnä')).toBeInTheDocument();
  });
});
