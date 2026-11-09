import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { faker } from '@faker-js/faker';

import { customRender as render } from '../../../../../common/test/customRender';
import { OccurrenceStatus } from '../../occurrenceStatus';
import { OccurrenceAccordionHeading } from '../OccurrenceAccordionHeading';
import { OccurrenceDetailsList } from '../OccurrenceDetailsList';

describe('OccurrenceAccordionHeading', () => {
  it('renders date, time and remaining spots count', () => {
    render(
      <OccurrenceAccordionHeading
        formattedDate="Ti 28.9.2026"
        formattedStartTime="18:30"
        status={OccurrenceStatus.Available}
        remainingCapacity={5}
      />
    );

    expect(screen.getByText(/Ti 28\.9\.2026 • klo 18:30/)).toBeInTheDocument();
    expect(screen.getByText('Paikkoja jäljellä: 5')).toBeInTheDocument();
  });

  it('renders status badges for enrolled and full occurrences', () => {
    const { rerender } = render(
      <OccurrenceAccordionHeading
        formattedDate="Ti 28.9.2026"
        formattedStartTime="18:30"
        status={OccurrenceStatus.Enrolled}
        remainingCapacity={5}
      />
    );
    expect(screen.getByText('Ilmoittautunut')).toBeInTheDocument();

    rerender(
      <OccurrenceAccordionHeading
        formattedDate="Ti 28.9.2026"
        formattedStartTime="18:30"
        status={OccurrenceStatus.Full}
        remainingCapacity={0}
      />
    );
    expect(screen.getByText('Täynnä')).toBeInTheDocument();
  });

  it('renders phrasing markup without interactive buttons when special features are present', () => {
    const { container } = render(
      <OccurrenceAccordionHeading
        formattedDate="Ti 28.9.2026"
        formattedStartTime="18:30"
        status={OccurrenceStatus.Available}
        remainingCapacity={3}
        accessibilities={['Yliaistiherkkyys']}
        speechless
      />
    );

    // Root element should be a phrasing element (span), never a div
    expect(container.firstElementChild?.tagName.toLowerCase()).toBe('span');
    expect(container.querySelectorAll('div')).toHaveLength(0);

    // No interactive tooltip buttons should be rendered inside the heading
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('OccurrenceDetailsList', () => {
  const venueName = faker.company.name();
  const venueAddress = faker.location.streetAddress();

  const baseOccurrence = {
    id: 'occ-1',
    time: '2026-09-28T15:30:00Z',
    remainingCapacity: 5,
    venue: {
      name: venueName,
      address: venueAddress,
    },
  };

  const baseEvent = {
    id: 'event-1',
    name: 'Event',
    duration: 90,
  };

  it('renders definition list fields and action button', () => {
    render(
      <OccurrenceDetailsList
        occurrence={baseOccurrence}
        event={baseEvent}
        childId="child-1"
        formattedTimeRange="18:30–20:00"
        languageText="Suomi, Ruotsi"
        accessibilities={['Yliaistiherkkyys']}
        onEnrol={vi.fn()}
        onSubscribe={vi.fn()}
        onUnsubscribe={vi.fn()}
      />
    );

    expect(screen.getByText('18:30–20:00')).toBeInTheDocument();
    expect(screen.getByText(venueName)).toBeInTheDocument();
    expect(screen.getByText(venueAddress)).toBeInTheDocument();
    expect(screen.getByText('Suomi, Ruotsi')).toBeInTheDocument();
    expect(screen.getByText('Yliaistiherkkyys')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Ilmoittaudu' })
    ).toBeInTheDocument();
  });
});
