import React, { FunctionComponent } from 'react';

import ProfileEventsList from './ProfileEventsList';
import ProfileNoEvent from './ProfileNoEvent';
import { childByIdQuery_child as ChildByIdResponse } from '../../api/generatedTypes/childByIdQuery';

interface ProfileEventsProps {
  child: ChildByIdResponse;
}

const ProfileEvents: FunctionComponent<ProfileEventsProps> = ({ child }) => {
  const hasEvents = (child: ChildByIdResponse) => {
    return child.availableEvents?.edges?.[0] ||
      child.enrolments.edges?.[0] ||
      child.pastEvents?.edges?.[0]
      ? true
      : false;
  };

  return hasEvents(child) ? (
    <ProfileEventsList
      availableEvents={child.availableEvents}
      child={child}
      enrolments={child.enrolments}
      pastEvents={child.pastEvents}
    />
  ) : (
    <ProfileNoEvent />
  );
};

export default ProfileEvents;
