import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';

import { getCurrentLanguage } from '../../../common/translation/TranslationUtils';
import { EventQuery } from '../../api/generatedTypes/graphql';
import eventQuery from '../queries/eventQuery';

export const useEventRouteGoBackTo = () => {
  const { i18n } = useTranslation();
  const currentLocale = getCurrentLanguage(i18n);
  const { childId, eventId } = useParams<{
    childId: string;
    eventId: string;
  }>();

  const { data: eventData } = useQuery<EventQuery>(eventQuery, {
    variables: { id: eventId, childId },
    skip: !eventId,
  });

  const eventGroupId = eventData?.event?.eventGroup?.id ?? '';

  if (eventGroupId) {
    // Go to event group page
    return `/${currentLocale}/profile/child/${childId}/event-group/${eventGroupId}`;
  }

  // Fallback if the eventGroupId could not be resolved
  return `/${currentLocale}/profile/child/${childId}`;
};
