import { FunctionComponent } from 'react';

import ProfileEventsList from './ProfileEventsList';
import ProfileNoEvent from './ProfileNoEvent';
import { ChildByIdQuery } from '../../api/generatedTypes/graphql';

type ChildByIdResponse = NonNullable<ChildByIdQuery['child']>;

interface ProfileEventsProps {
  child: ChildByIdResponse;
}

const ProfileEvents: FunctionComponent<ProfileEventsProps> = ({ child }) => {
  const hasEvents = (child: ChildByIdResponse) => {
    return child.upcomingEventsAndEventGroups?.edges?.[0] ||
      child.activeInternalAndTicketSystemEnrolments?.edges?.[0] ||
      child.pastEvents?.edges?.[0]
      ? true
      : false;
  };

  return hasEvents(child) ? (
    <ProfileEventsList
      upcomingEventsAndEventGroups={child.upcomingEventsAndEventGroups}
      childId={child.id}
      pastEvents={child.pastEvents}
      enrolments={child.activeInternalAndTicketSystemEnrolments}
    />
  ) : (
    <ProfileNoEvent />
  );
};

export default ProfileEvents;
