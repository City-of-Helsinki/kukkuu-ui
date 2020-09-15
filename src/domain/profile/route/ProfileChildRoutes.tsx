import React from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';

import Event from '../../event/Event';
import ProfileChildDetail from '../children/child/ProfileChildDetail';
import Enrol from '../../event/enrol/Enrol';
import EventIsEnrolled from '../../event/EventIsEnrolled';

const ProfileChildRoute = ({ match: { path } }: RouteComponentProps) => {
  return (
    <Switch>
      <Route exact component={ProfileChildDetail} path={path} />
      <Route exact component={Event} path={`${path}/event/:eventId`} />
      <Route exact component={Event} path={`${path}/event/:eventId/past`} />
      <Route
        exact
        component={EventIsEnrolled}
        path={`${path}/occurrence/:occurrenceId`}
      />
      <Route
        exact
        component={Enrol}
        path={`${path}/event/:eventId/occurrence/:occurrenceId/enrol`}
      />
    </Switch>
  );
};
export default ProfileChildRoute;