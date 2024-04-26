import 'react-toastify/dist/ReactToastify.css';
import { Outlet } from 'react-router';

import PageLayout from './layout/PageLayout';
import useHashAnchorLinks from './useHashAnchorLinks';
import AppTitleAnnouncer from './AppTitleAnnouncer';
import { ScrollToTop } from '../../common/route/RouteUtils';

const Layout = () => {
  useHashAnchorLinks();

  return (
    <>
      <ScrollToTop />
      <PageLayout>
        <AppTitleAnnouncer />
        <Outlet />
      </PageLayout>
    </>
  );
};

export default Layout;
