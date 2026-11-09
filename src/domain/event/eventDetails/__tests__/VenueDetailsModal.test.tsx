import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { faker } from '@faker-js/faker';

import { customRender as render } from '../../../../common/test/customRender';
import { VenueDetailsModal, VenueDetailsModalVenue } from '../VenueDetailsModal';

describe('VenueDetailsModal', () => {
  const mockVenue: VenueDetailsModalVenue = {
    id: faker.string.uuid(),
    name: faker.company.name(),
    address: faker.location.streetAddress(),
    description: faker.lorem.paragraph(),
    accessibilityInfo: faker.lorem.sentence(),
    arrivalInstructions: faker.lorem.sentence(),
    wcAndFacilities: faker.lorem.sentence(),
  };

  it('renders venue details and sections when open', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(
      <VenueDetailsModal
        isOpen={true}
        onClose={handleClose}
        venue={mockVenue}
      />
    );

    // Title / Header
    expect(screen.getByText('Lisätietoa tapahtumapaikasta')).toBeInTheDocument();

    // Venue name & Address in body
    expect(screen.getByText(mockVenue.name!)).toBeInTheDocument();
    expect(screen.getByText(mockVenue.address!)).toBeInTheDocument();

    // Description & other sections
    expect(screen.getByText(mockVenue.description!)).toBeInTheDocument();
    expect(screen.getByText('Esteettömyystiedot')).toBeInTheDocument();
    expect(screen.getByText(mockVenue.accessibilityInfo!)).toBeInTheDocument();
    expect(screen.getByText('Saapumisohjeet')).toBeInTheDocument();
    expect(screen.getByText(mockVenue.arrivalInstructions!)).toBeInTheDocument();
    expect(screen.getByText('WC- ja muut tilat')).toBeInTheDocument();
    expect(screen.getByText(mockVenue.wcAndFacilities!)).toBeInTheDocument();

    // Close button
    const closeButtons = screen.getAllByRole('button', { name: 'Sulje' });
    expect(closeButtons.length).toBeGreaterThanOrEqual(1);

    await user.click(closeButtons[0]);
    expect(handleClose).toHaveBeenCalled();
  });

  it('returns null when venue is null', () => {
    const { container } = render(
      <VenueDetailsModal
        isOpen={true}
        onClose={vi.fn()}
        venue={null}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('exposes content section subcomponents as compound components', () => {
    expect(VenueDetailsModal.AddressSection).toBeDefined();
    expect(VenueDetailsModal.DescriptionSection).toBeDefined();
    expect(VenueDetailsModal.AccessibilitySection).toBeDefined();
    expect(VenueDetailsModal.ArrivalInstructionsSection).toBeDefined();
    expect(VenueDetailsModal.WcAndFacilitiesSection).toBeDefined();
  });

  it('renders section subcomponents directly and returns null when prop is missing', () => {
    const { container: emptyContainer } = render(
      <VenueDetailsModal.AccessibilitySection accessibilityInfo={null} />
    );
    expect(emptyContainer).toBeEmptyDOMElement();

    render(
      <VenueDetailsModal.AccessibilitySection
        accessibilityInfo="Hissi käytettävissä"
      />
    );
    expect(screen.getByText('Esteettömyystiedot')).toBeInTheDocument();
    expect(screen.getByText('Hissi käytettävissä')).toBeInTheDocument();
  });
});
