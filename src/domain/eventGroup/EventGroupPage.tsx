import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router';

import eventGroupQuery from './queries/eventGroupQuery';
import EventGroup from './EventGroup';

type Params = {
  childId: string;
  eventGroupId: string;
};

const EventGroupPage = () => {
  const { childId, eventGroupId } = useParams<Params>();
  const query = useQuery(eventGroupQuery, {
    variables: {
      id: eventGroupId,
    },
  });

  return <EventGroup query={query} childId={childId} />;
};

export default EventGroupPage;
