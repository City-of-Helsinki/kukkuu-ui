import { useQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router';

import eventGroupQuery from './queries/eventGroupQuery';
import EventGroup from './EventGroup';

type Params = {
  childId: string;
  eventGroupId: string;
};

const EventGroupPage = () => {
  const { childId, eventGroupId } = useParams<Params>();
  const history = useHistory();
  const query = useQuery(eventGroupQuery, {
    variables: {
      id: eventGroupId,
      childId,
    },
    onCompleted: (data) => {
      const events = data?.eventGroup?.events?.edges ?? [];

      // If there are no events the child can enrol into, assume that they have
      // already enrolled and redirect them into their profile.
      if (events.length === 0) {
        history.replace('/profile');
      }
    },
  });

  return <EventGroup query={query} childId={childId} />;
};

export default EventGroupPage;
