import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconLocation, IconSize } from 'hds-react';

import { IconTooltip } from './IconTooltip';

export type OccurrenceLocationTooltipProps = {
  address?: string | null;
  className?: string;
  size?: IconSize;
};

/**
 * Location pin icon button that displays the venue address in an accessible tooltip.
 * If no address is present, returns null.
 */
export const OccurrenceLocationTooltip: React.FC<
  OccurrenceLocationTooltipProps
> = ({ address, className, size = IconSize.Small }) => {
  const { t } = useTranslation();

  if (!address || address.trim().length === 0) {
    return null;
  }

  return (
    <IconTooltip
      className={className}
      label={t('event.occurrencesTable.venueAddressAriaLabel', { address })}
      icon={<IconLocation size={size} />}
    >
      <span>{address}</span>
    </IconTooltip>
  );
};

export default OccurrenceLocationTooltip;
