import React, { FunctionComponent } from 'react';

import ProfileEventsList from './ProfileEventsList';
import ProfileNoEvent from './ProfileNoEvent';
import { childByIdQuery_child as ChildByIdResponse } from '../../api/generatedTypes/childByIdQuery';

interface ProfileEventsProps {
  child: ChildByIdResponse;
}

const ProfileEvents: FunctionComponent<ProfileEventsProps> = ({ child }) => {
  const hasEvents = (child: ChildByIdResponse) => {
    return child.availableEvents || child.enrolments || child.pastEvents;
  };

  return hasEvents(child) ? (
    // TODO: normalize? null?
    <ProfileEventsList
      availableEvents={child.availableEvents || undefined}
      enrolments={child.enrolments}
      pastEvents={child.pastEvents || undefined}
    />
  ) : (
    <ProfileNoEvent />
  );
};

export default ProfileEvents;
