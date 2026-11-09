import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { faker } from '@faker-js/faker';

import { customRender as render } from '../../../../../common/test/customRender';
import { OccurrenceVenueLink } from '../OccurrenceVenueLink';

describe('OccurrenceVenueLink', () => {
  it('renders dash when venue name is missing', () => {
    render(<OccurrenceVenueLink venue={null} />);
    expect(screen.getByText('–')).toBeInTheDocument();
  });

  it('renders venue name button and triggers callback on click', async () => {
    const user = userEvent.setup();
    const onVenueClick = vi.fn();
    const venue = {
      name: faker.company.name(),
      address: faker.location.streetAddress(),
    };

    render(
      <OccurrenceVenueLink venue={venue} onVenueInfoClick={onVenueClick} />
    );

    const button = screen.getByRole('button', { name: venue.name });
    expect(button).toBeInTheDocument();

    await user.click(button);
    expect(onVenueClick).toHaveBeenCalledWith(venue);

    // Location tooltip button is rendered
    expect(
      screen.getByRole('button', { name: `Näytä osoite: ${venue.address}` })
    ).toBeInTheDocument();
  });

  it('omits location tooltip button when showLocationTooltip is false or address is missing', () => {
    const venueName = faker.company.name();
    render(
      <OccurrenceVenueLink
        venue={{ name: venueName }}
        showLocationTooltip={false}
      />
    );

    expect(
      screen.getByRole('button', { name: venueName })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Näytä osoite/ })
    ).not.toBeInTheDocument();
  });
});
