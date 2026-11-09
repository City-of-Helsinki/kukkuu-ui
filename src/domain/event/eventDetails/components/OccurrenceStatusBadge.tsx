import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconAlertCircle, StatusLabel } from 'hds-react';

import { OccurrenceStatus } from '../occurrenceStatus';

export type OccurrenceStatusBadgeProps = {
  status: OccurrenceStatus.Enrolled | OccurrenceStatus.Full;
  className?: string;
};

/**
 * Status badge for event occurrences:
 * - OccurrenceStatus.Enrolled: HDS success StatusLabel indicating that the child is enrolled.
 * - OccurrenceStatus.Full: HDS alert StatusLabel with alert icon indicating the occurrence is full.
 */
export const OccurrenceStatusBadge: React.FC<OccurrenceStatusBadgeProps> = ({
  status,
  className,
}) => {
  const { t } = useTranslation();

  if (status === OccurrenceStatus.Enrolled) {
    return (
      <StatusLabel type="success" className={className}>
        {t('event.occurrencesTable.enrolledBadge')}
      </StatusLabel>
    );
  }

  if (status === OccurrenceStatus.Full) {
    return (
      <StatusLabel
        type="alert"
        iconStart={<IconAlertCircle aria-hidden="true" />}
        className={className}
      >
        {t('event.occurrencesTable.fullBadge')}
      </StatusLabel>
    );
  }

  return null;
};

export default OccurrenceStatusBadge;
