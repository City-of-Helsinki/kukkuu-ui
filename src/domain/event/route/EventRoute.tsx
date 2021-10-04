import React, { FunctionComponent } from 'react';
import { Switch, useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';

import { getCurrentLanguage } from '../../../common/translation/TranslationUtils';
import AppRoute from '../../app/AppRoute';
import Event from '../Event';
import { eventQuery as EventQueryType } from '../../api/generatedTypes/eventQuery';
import eventQuery from '../queries/eventQuery';

export const useEventRouteGoBack = () => {
  const { i18n } = useTranslation();
  const history = useHistory();
  const currentLocale = getCurrentLanguage(i18n);
  const { childId, eventGroupId, eventId } =
    useParams<{ childId: string; eventGroupId: string; eventId: string }>();

  const { data: eventData } = useQuery<EventQueryType>(eventQuery, {
    variables: { id: eventId, childId },
    skip: !!eventGroupId || !eventId,
  });

  // Go to event group page
  if (eventGroupId) {
    return () =>
      history.push(
        `/${currentLocale}/profile/child/${childId}/event-group/${eventGroupId}`
      );
  }

  // When the event group id not given, it needs to be resolved
  if (!eventGroupId && eventData?.event?.eventGroup?.id) {
    // Go to event group page
    return () =>
      history.push(
        `/${currentLocale}/profile/child/${childId}/event-group/${eventData?.event?.eventGroup?.id}`
      );
  }

  // Fallback if the eventGroupId could not be resolved
  return () => history.push(`/${currentLocale}/profile/child/${childId}`);
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
