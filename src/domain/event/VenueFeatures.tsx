import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import { OccurrenceVenue } from './types/OccurrenceQueryTypes';
import Collapsible from '../../common/components/collapsible/Collapsible';

interface VenueFeaturesProps {
  venue: OccurrenceVenue;
}

const VenueFeatures: FunctionComponent<VenueFeaturesProps> = ({ venue }) => {
  const { t } = useTranslation();

  return (
    <>
      {venue.arrivalInstructions && (
        <Collapsible
          item={{
            header: t('venue.features.arrival.heading'),
            body: venue.arrivalInstructions,
          }}
        />
      )}
      {venue.accessibilityInfo && (
        <Collapsible
          item={{
            header: t('venue.features.accessibility.heading'),
            body: venue.accessibilityInfo,
          }}
        />
      )}
      {venue.wcAndFacilities && (
        <Collapsible
          item={{
            header: t('venue.features.wcAndFacilities.heading'),
            body: venue.wcAndFacilities,
          }}
        />
      )}
      {venue.additionalInfo && (
        <Collapsible
          item={{
            header: t('venue.features.additionalInformation.heading'),
            body: venue.additionalInfo,
          }}
        />
      )}
    </>
  );
};

export default VenueFeatures;
