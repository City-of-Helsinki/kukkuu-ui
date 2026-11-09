import React from 'react';
import classNames from 'classnames';

import { OccurrenceLocationTooltip } from './OccurrenceLocationTooltip';
import styles from './occurrenceVenueLink.module.scss';

export type OccurrenceVenue = {
  id?: string;
  name?: string | null;
  address?: string | null;
  description?: string | null;
  accessibilityInfo?: string | null;
  arrivalInstructions?: string | null;
  wcAndFacilities?: string | null;
  wwwUrl?: string | null;
};

export type OccurrenceVenueLinkProps = {
  venue?: OccurrenceVenue | null;
  onVenueInfoClick?: (venue: OccurrenceVenue) => void;
  showLocationTooltip?: boolean;
  className?: string;
};

/**
 * Renders venue name as an interactive link opening the venue dialog,
 * accompanied by an address location tooltip pin when an address exists.
 */
export const OccurrenceVenueLink: React.FC<OccurrenceVenueLinkProps> = ({
  venue,
  onVenueInfoClick,
  showLocationTooltip = true,
  className,
}) => {
  const venueName = venue?.name?.trim();

  if (!venueName) {
    return <span>–</span>;
  }

  return (
    <div className={classNames(styles.venueWrapper, className)}>
      <button
        type="button"
        className={styles.venueLink}
        onClick={() => {
          if (venue) {
            onVenueInfoClick?.(venue);
          }
        }}
      >
        {venueName}
      </button>

      {showLocationTooltip && (
        <OccurrenceLocationTooltip address={venue?.address} />
      )}
    </div>
  );
};

export default OccurrenceVenueLink;
