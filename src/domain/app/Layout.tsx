import 'react-toastify/dist/ReactToastify.css';
import { Outlet } from 'react-router';
import { useSelector } from 'react-redux';

import { isSessionExpiredPromptOpenSelector } from './state/ui/UISelectors';
import SessionAlert from './sessionAlert/SessionAlert';
import PageLayout from './layout/PageLayout';
import useHashAnchorLinks from './useHashAnchorLinks';
import AppTitleAnnouncer from './AppTitleAnnouncer';
import { ScrollToTop } from '../../common/route/RouteUtils';

const Layout = () => {
  useHashAnchorLinks();

  const isSessionPromptOpen = useSelector(isSessionExpiredPromptOpenSelector);
  return (
    <>
      <ScrollToTop />
      <PageLayout>
        <AppTitleAnnouncer />
        {isSessionPromptOpen && <SessionAlert isOpen={isSessionPromptOpen} />}
        <Outlet />
      </PageLayout>
    </>
  );
};

export default Layout;
