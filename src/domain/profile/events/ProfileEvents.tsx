import React, { FunctionComponent } from 'react';

import ProfileEventsList from './ProfileEventsList';
import ProfileNoEvent from './ProfileNoEvent';
import { childByIdQuery_child as ChildByIdResponse } from '../../api/generatedTypes/childByIdQuery';

interface ProfileEventsProps {
  child: ChildByIdResponse;
}

const ProfileEvents: FunctionComponent<ProfileEventsProps> = ({ child }) => {
  const hasEvents = (child: ChildByIdResponse) => {
    let childHasEvents = false;

    if (child.availableEvents?.edges?.[0]) {
      childHasEvents = true;
    } else if (child.enrolments.edges?.[0]) {
      childHasEvents = true;
    } else if (child.pastEvents?.edges?.[0]) {
      childHasEvents = true;
    }

    return childHasEvents;
  };

  return hasEvents(child) ? (
    <ProfileEventsList
      availableEvents={child.availableEvents}
      enrolments={child.enrolments}
      pastEvents={child.pastEvents}
    />
  ) : (
    <ProfileNoEvent />
  );
};

export default ProfileEvents;
