import { Route, Routes } from 'react-router-dom';
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
const ProfileChildRoute = () => {
  const { t } = useTranslation();

  return (
    <Routes>
      <Route
        index
        element={
          <AppRoute
            title={t('profile.child.detail.page.title')}
            element={<ProfileChildDetail />}
            path={'/'}
          />
        }
      />
      <Route
        path={`/event-group/:eventGroupId`}
        element={
          <AppRoute
            noTitle
            element={<EventGroupPage />}
            path={`/event-group/:eventGroupId`}
          />
        }
      />
      <Route
        path={`/event/:eventId`}
        element={
          <AppRoute noTitle element={<Event />} path={`/event/:eventId`} />
        }
      />
      <Route
        path={`/event/:eventId/past`}
        element={
          <AppRoute noTitle element={<Event />} path={`/event/:eventId/past`} />
        }
      />
      <Route
        path={`/event/:eventId/external-enrolment`}
        element={
          <AppRoute
            noTitle
            element={<ExternalTicketSystemEventIsEnrolled />}
            path={`/event/:eventId/external-enrolment`}
          />
        }
      />
      <Route
        path={`/event/:eventId/redirect`}
        element={
          <AppRoute
            title={t('eventRedirectPage.metaTitle')}
            element={<EventRedirect />}
            path={`/event/:eventId/redirect`}
          />
        }
      />
      <Route
        path={`/occurrence/:occurrenceId`}
        element={
          <AppRoute
            noTitle
            element={<EventIsEnrolled />}
            path={`/occurrence/:occurrenceId`}
          />
        }
      />
      <Route
        path={`/event/:eventId/occurrence/:occurrenceId/enrol`}
        element={
          <AppRoute
            title={t('enrolPage.enrol')}
            element={<EnrolPage />}
            path={`/event/:eventId/occurrence/:occurrenceId/enrol`}
          />
        }
      />
    </Routes>
  );
};
export default ProfileChildRoute;
