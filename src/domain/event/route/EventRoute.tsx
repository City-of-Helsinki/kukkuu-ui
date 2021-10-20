import { FunctionComponent } from 'react';
import { Switch, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';

import { getCurrentLanguage } from '../../../common/translation/TranslationUtils';
import AppRoute from '../../app/AppRoute';
import Event from '../Event';
import { eventQuery as EventQueryType } from '../../api/generatedTypes/eventQuery';
import eventQuery from '../queries/eventQuery';

export const useEventRouteGoBackTo = () => {
  const { i18n } = useTranslation();
  const currentLocale = getCurrentLanguage(i18n);
  const { childId, eventId } =
    useParams<{ childId: string; eventId: string }>();

  const { data: eventData } = useQuery<EventQueryType>(eventQuery, {
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

const EventRoute: FunctionComponent = () => {
  const { i18n } = useTranslation();
  const currentLocale = getCurrentLanguage(i18n);
  return (
    <Switch>
      <AppRoute
        noTitle
        exact
        component={Event}
        path={`/${currentLocale}/event/:eventId`}
      />
    </Switch>
  );
};
export default EventRoute;
