import { Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import AppRoute from '../../app/AppRoute';
import Event from '../../event/Event';
import EnrolPage from '../../event/enrol/EnrolPage';
import EventIsEnrolled from '../../event/EventIsEnrolled';
import EventRedirect from '../../event/EventRedirect';
import EventGroupPage from '../../eventGroup/EventGroupPage';
import ProfileChildDetail from '../children/child/ProfileChildDetail';
import ExternalTicketSystemEventIsEnrolled from '../../event/ExternalTicketSystemEventIsEnrolled';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProfileChildRoute = ({ match: { path } }: any) => {
  const { t } = useTranslation();

  return (
    <Routes>
      <AppRoute
        title={t('profile.child.detail.page.title')}
        element={<ProfileChildDetail />}
        path={path}
      />
      <AppRoute
        noTitle
        element={<EventGroupPage />}
        path={`${path}/event-group/:eventGroupId`}
      />
      <AppRoute noTitle element={<Event />} path={`${path}/event/:eventId`} />
      <AppRoute
        noTitle
        element={<Event />}
        path={`${path}/event/:eventId/past`}
      />
      <AppRoute
        noTitle
        element={<EventIsEnrolled />}
        path={`${path}/occurrence/:occurrenceId`}
      />
      <AppRoute
        noTitle
        element={<ExternalTicketSystemEventIsEnrolled />}
        path={`${path}/event/:eventId/external-enrolment`}
      />
      <AppRoute
        title={t('enrolPage.enrol')}
        element={<EnrolPage />}
        path={`${path}/event/:eventId/occurrence/:occurrenceId/enrol`}
      />
      <AppRoute
        title={t('eventRedirectPage.metaTitle')}
        element={<EventRedirect />}
        path={`${path}/event/:eventId/redirect`}
      />
    </Routes>
  );
};
export default ProfileChildRoute;
