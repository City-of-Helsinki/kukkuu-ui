import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, IconLinkExternal, IconSize } from 'hds-react';

import Button from '../../../common/components/button/Button';
import Paragraph from '../../../common/components/paragraph/Paragraph';
import styles from './venueDetailsModal.module.scss';

export type VenueDetailsModalVenue = {
  id?: string;
  name?: string | null;
  address?: string | null;
  description?: string | null;
  accessibilityInfo?: string | null;
  arrivalInstructions?: string | null;
  wcAndFacilities?: string | null;
  wwwUrl?: string | null;
};

// ============================================================================
// Subcomponents for individual venue modal content sections
// ============================================================================

export type VenueAddressSectionProps = {
  address?: string | null;
};

export const VenueAddressSection: React.FC<VenueAddressSectionProps> = ({
  address,
}) => {
  const { t } = useTranslation();
  if (!address) return null;

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;

  return (
    <div className={styles.addressBlock}>
      <p className={styles.addressText}>{address}</p>
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.mapLink}
      >
        <span>{t('event.venueModal.openMap')}</span>
        <IconLinkExternal size={IconSize.ExtraSmall} aria-hidden="true" />
      </a>
    </div>
  );
};

export type VenueDescriptionSectionProps = {
  description?: string | null;
};

export const VenueDescriptionSection: React.FC<
  VenueDescriptionSectionProps
> = ({ description }) => {
  if (!description) return null;
  return (
    <div className={styles.section}>
      <Paragraph text={description} />
    </div>
  );
};

export type VenueAccessibilitySectionProps = {
  accessibilityInfo?: string | null;
};

export const VenueAccessibilitySection: React.FC<
  VenueAccessibilitySectionProps
> = ({ accessibilityInfo }) => {
  const { t } = useTranslation();
  if (!accessibilityInfo) return null;
  return (
    <div className={styles.section}>
      <h4 className={styles.sectionTitle}>
        {t('event.venueModal.accessibility')}
      </h4>
      <Paragraph text={accessibilityInfo} />
    </div>
  );
};

export type VenueArrivalInstructionsSectionProps = {
  arrivalInstructions?: string | null;
};

export const VenueArrivalInstructionsSection: React.FC<
  VenueArrivalInstructionsSectionProps
> = ({ arrivalInstructions }) => {
  const { t } = useTranslation();
  if (!arrivalInstructions) return null;
  return (
    <div className={styles.section}>
      <h4 className={styles.sectionTitle}>
        {t('event.venueModal.arrivalInstructions')}
      </h4>
      <Paragraph text={arrivalInstructions} />
    </div>
  );
};

export type VenueWcAndFacilitiesSectionProps = {
  wcAndFacilities?: string | null;
};

export const VenueWcAndFacilitiesSection: React.FC<
  VenueWcAndFacilitiesSectionProps
> = ({ wcAndFacilities }) => {
  const { t } = useTranslation();
  if (!wcAndFacilities) return null;
  return (
    <div className={styles.section}>
      <h4 className={styles.sectionTitle}>
        {t('event.venueModal.wcAndFacilities')}
      </h4>
      <Paragraph text={wcAndFacilities} />
    </div>
  );
};

// ============================================================================
// Main Modal Coordinator Component
// ============================================================================

export type VenueDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  venue: VenueDetailsModalVenue | null;
};

export type VenueDetailsModalComponent = React.FC<VenueDetailsModalProps> & {
  AddressSection: typeof VenueAddressSection;
  DescriptionSection: typeof VenueDescriptionSection;
  AccessibilitySection: typeof VenueAccessibilitySection;
  ArrivalInstructionsSection: typeof VenueArrivalInstructionsSection;
  WcAndFacilitiesSection: typeof VenueWcAndFacilitiesSection;
};

/**
 * Modal dialog displaying detailed venue information including description,
 * accessibility notes, arrival instructions, and Google Maps search link.
 */
export const VenueDetailsModal: VenueDetailsModalComponent = ({
  isOpen,
  onClose,
  venue,
}) => {
  const { t } = useTranslation();

  if (!venue) {
    return null;
  }

  const titleId = `venue-modal-title-${venue.id || 'default'}`;
  const descriptionId = `venue-modal-description-${venue.id || 'default'}`;

  return (
    <Dialog
      id="venue-details-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      isOpen={isOpen}
      close={onClose}
      closeButtonLabelText={t('common.closeButton.altText')}
      variant="primary"
      className={styles.modal}
    >
      <Dialog.Header
        id={titleId}
        title={venue.name || t('event.venueModal.title')}
      />
      <Dialog.Content>
        <div id={descriptionId}>
          <VenueAddressSection address={venue.address} />
          <VenueDescriptionSection description={venue.description} />
          <VenueAccessibilitySection
            accessibilityInfo={venue.accessibilityInfo}
          />
          <VenueArrivalInstructionsSection
            arrivalInstructions={venue.arrivalInstructions}
          />
          <VenueWcAndFacilitiesSection
            wcAndFacilities={venue.wcAndFacilities}
          />
        </div>
      </Dialog.Content>
      <Dialog.ActionButtons>
        <Button variant="secondary" onClick={onClose}>
          {t('event.venueModal.close')}
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
  );
};

VenueDetailsModal.AddressSection = VenueAddressSection;
VenueDetailsModal.DescriptionSection = VenueDescriptionSection;
VenueDetailsModal.AccessibilitySection = VenueAccessibilitySection;
VenueDetailsModal.ArrivalInstructionsSection = VenueArrivalInstructionsSection;
VenueDetailsModal.WcAndFacilitiesSection = VenueWcAndFacilitiesSection;

export default VenueDetailsModal;
