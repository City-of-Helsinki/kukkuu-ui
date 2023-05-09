import { Switch, RouteComponentProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import AppRoute from '../../app/AppRoute';
import Event from '../../event/Event';
import EnrolPage from '../../event/enrol/EnrolPage';
import EventIsEnrolled from '../../event/EventIsEnrolled';
import EventRedirect from '../../event/EventRedirect';
import EventGroupPage from '../../eventGroup/EventGroupPage';
import ProfileChildDetail from '../children/child/ProfileChildDetail';
import ExternalTicketSystemEventIsEnrolled from '../../event/ExternalTicketSystemEventIsEnrolled';

const ProfileChildRoute = ({ match: { path } }: RouteComponentProps) => {
  const { t } = useTranslation();

  return (
    <Switch>
      <AppRoute
        title={t('profile.child.detail.page.title')}
        exact
        component={ProfileChildDetail}
        path={path}
      />
      <AppRoute
        noTitle
        exact
        component={EventGroupPage}
        path={`${path}/event-group/:eventGroupId`}
      />
      <AppRoute
        noTitle
        exact
        component={Event}
        path={`${path}/event/:eventId`}
      />
      <AppRoute
        noTitle
        exact
        component={Event}
        path={`${path}/event/:eventId/past`}
      />
      <AppRoute
        noTitle
        exact
        component={EventIsEnrolled}
        path={`${path}/occurrence/:occurrenceId`}
      />
      <AppRoute
        noTitle
        exact
        component={ExternalTicketSystemEventIsEnrolled}
        path={`${path}/event/:eventId/external-enrolment`}
      />
      <AppRoute
        title={t('enrolPage.enrol')}
        exact
        component={EnrolPage}
        path={`${path}/event/:eventId/occurrence/:occurrenceId/enrol`}
      />
      <AppRoute
        title={t('eventRedirectPage.metaTitle')}
        exact
        component={EventRedirect}
        path={`${path}/event/:eventId/redirect`}
      />
    </Switch>
  );
};
export default ProfileChildRoute;
