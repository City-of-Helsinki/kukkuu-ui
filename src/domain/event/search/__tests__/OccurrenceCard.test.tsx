import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';

import { customRender as render } from '../../../../common/test/customRender';
import OccurrenceCard from '../OccurrenceCard';
import type { FlattenedOccurrenceItem } from '../../types/ChildAvailableOccurrencesTypes';

describe('OccurrenceCard', () => {
  const baseItem: FlattenedOccurrenceItem = {
    event: {
      id: 'event-123',
      name: 'Musiikkileikki',
      shortDescription: 'Hauskaa musiikkia vauvoille',
      image: null,
      imageAltText: null,
      duration: 45,
      canChildEnroll: true,
      occurrences: { edges: [] },
    },
    occurrence: {
      id: 'occ-456',
      time: '2026-10-04T10:00:00Z',
      remainingCapacity: 10,
      occurrenceLanguage: 'FI' as any,
      venue: {
        id: 'venue-789',
        name: 'Annantalo',
        address: 'Annankatu 30',
      },
    },
  };

  it('renders event details, time, venue, and languages', () => {
    render(<OccurrenceCard childId="child-1" item={baseItem} />);

    expect(screen.getByText('Musiikkileikki')).toBeInTheDocument();
    expect(screen.getByText('Hauskaa musiikkia vauvoille')).toBeInTheDocument();
    expect(screen.getByText('13:00–13:45')).toBeInTheDocument();
    expect(screen.getByText('Annantalo, Annankatu 30')).toBeInTheDocument();
    expect(screen.getByText(/Kielet:\s*Suomi/)).toBeInTheDocument();
    expect(screen.getByText('Esimerkkimerkki 1')).toBeInTheDocument();
    expect(screen.getByText('Esimerkkimerkki 2')).toBeInTheDocument();
  });

  it('renders enabled enrolment button when occurrence is enrollable', () => {
    render(<OccurrenceCard childId="child-1" item={baseItem} />);

    const enrolButton = screen.getByRole('link', { name: 'Ilmoittaudu' });
    expect(enrolButton).toBeInTheDocument();
    expect(enrolButton).toHaveAttribute(
      'href',
      '/profile/child/child-1/event/event-123/occurrence/occ-456/enrol'
    );

    const readMoreLink = screen.getByRole('link', { name: 'Lue lisää' });
    expect(readMoreLink).toHaveAttribute(
      'href',
      '/profile/child/child-1/event/event-123?occurrenceId=occ-456'
    );
  });

  it('renders disabled enrolment button when occurrence has no capacity', () => {
    const fullItem: FlattenedOccurrenceItem = {
      ...baseItem,
      occurrence: {
        ...baseItem.occurrence,
        remainingCapacity: 0,
      },
    };

    render(<OccurrenceCard childId="child-1" item={fullItem} />);

    const enrolButton = screen.getByRole('button', { name: 'Ilmoittaudu' });
    expect(enrolButton).toBeDisabled();
  });
});
