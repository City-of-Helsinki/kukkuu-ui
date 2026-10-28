import { describe, expect, it, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';

import { customRender as render } from '../../../../common/test/customRender';
import { VenueDetailsModal, VenueDetailsModalVenue } from '../VenueDetailsModal';

describe('VenueDetailsModal', () => {
  const mockVenue: VenueDetailsModalVenue = {
    id: 'venue-1',
    name: 'Nukketeatteri Sampo',
    address: 'Erottajankatu 7, 00130 Helsinki',
    description: 'Tunnettu nukketeatteri Helsingin keskustassa.',
    accessibilityInfo: 'Pyörätuoliluiska sisäänkäynnillä.',
    arrivalInstructions: 'Raitiovaunu 3 ja 6 pysähtyvät lähellä.',
    wcAndFacilities: 'Esteetön wc ensimmäisessä kerroksessa.',
  };

  it('renders venue details and sections when open', () => {
    const handleClose = vi.fn();
    render(
      <VenueDetailsModal
        isOpen={true}
        onClose={handleClose}
        venue={mockVenue}
      />
    );

    // Title / Header
    expect(screen.getByText('Nukketeatteri Sampo')).toBeInTheDocument();

    // Address & Map link
    expect(screen.getByText('Erottajankatu 7, 00130 Helsinki')).toBeInTheDocument();
    const mapLink = screen.getByRole('link', { name: /Avaa kartta/i });
    expect(mapLink).toHaveAttribute(
      'href',
      expect.stringContaining('Erottajankatu%207')
    );

    // Description & other sections
    expect(
      screen.getByText('Tunnettu nukketeatteri Helsingin keskustassa.')
    ).toBeInTheDocument();
    expect(screen.getByText('Esteettömyystiedot')).toBeInTheDocument();
    expect(
      screen.getByText('Pyörätuoliluiska sisäänkäynnillä.')
    ).toBeInTheDocument();
    expect(screen.getByText('Saapumisohjeet')).toBeInTheDocument();
    expect(
      screen.getByText('Raitiovaunu 3 ja 6 pysähtyvät lähellä.')
    ).toBeInTheDocument();
    expect(screen.getByText('WC- ja muut tilat')).toBeInTheDocument();
    expect(
      screen.getByText('Esteetön wc ensimmäisessä kerroksessa.')
    ).toBeInTheDocument();

    // Close button
    const closeButtons = screen.getAllByRole('button', { name: 'Sulje' });
    expect(closeButtons.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(closeButtons[0]);
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
