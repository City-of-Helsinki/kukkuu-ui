import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';

import { customRender as render } from '../../../../common/test/customRender';
import OccurrenceCard from '../OccurrenceCard';
import { OccurrenceCardProvider } from '../OccurrenceCardContext';
import type { FlattenedOccurrenceItem } from '../../types/ChildAvailableOccurrencesTypes';
import { Language } from '../../../api/generatedTypes/graphql';

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
      occurrenceLanguage: Language.Fi,
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

  it('places date badge in upper right corner of the content area by default', () => {
    const { container } = render(
      <OccurrenceCard childId="child-1" item={baseItem} />
    );

    const badge = screen.getByText('SU');
    expect(badge).toBeInTheDocument();

    // Verify it is inside .badgeTopRight in .topRow and NOT in .badgeOverImage
    expect(container.querySelector('._badgeTopRight_e35824, [class*="badgeTopRight"]')).toBeInTheDocument();
    expect(container.querySelector('._badgeOverImage_e35824, [class*="badgeOverImage"]')).toBeNull();
  });

  it('allows configuring date badge position via direct prop', () => {
    const { container, rerender } = render(
      <OccurrenceCard
        childId="child-1"
        item={baseItem}
        dateBadgePosition="over-image"
      />
    );

    expect(container.querySelector('[class*="badgeOverImage"]')).toBeInTheDocument();
    expect(container.querySelector('[class*="badgeTopRight"]')).toBeNull();

    rerender(
      <OccurrenceCard
        childId="child-1"
        item={baseItem}
        dateBadgePosition="none"
      />
    );
    expect(screen.queryByText('SU')).not.toBeInTheDocument();
  });

  it('allows configuring date badge position via OccurrenceCardProvider context', () => {
    const { container } = render(
      <OccurrenceCardProvider value={{ dateBadgePosition: 'before-title' }}>
        <OccurrenceCard childId="child-1" item={baseItem} />
      </OccurrenceCardProvider>
    );

    expect(container.querySelector('[class*="badgeBeforeTitle"]')).toBeInTheDocument();
    expect(container.querySelector('[class*="badgeTopRight"]')).toBeNull();
  });
});
