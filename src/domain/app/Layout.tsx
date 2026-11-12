import 'react-toastify/dist/ReactToastify.css';
import { Outlet } from 'react-router';

import PageLayout from './layout/PageLayout';
import useHashAnchorLinks from './useHashAnchorLinks';
import AppTitleAnnouncer from './AppTitleAnnouncer';
import { ScrollToTop } from '../../common/route/RouteUtils';
import AppConfig from './AppConfig';
import CimodeIndicator from '../../common/translation/cimode/CimodeIndicator';
import useCimodeSync from '../../common/translation/cimode/useCimodeSync';

const Layout = () => {
  useHashAnchorLinks();
  useCimodeSync();

  return (
    <>
      <ScrollToTop />
      <PageLayout>
        <AppTitleAnnouncer />
        <Outlet />
      </PageLayout>
      {AppConfig.translationToolEnabled && <CimodeIndicator />}
    </>
  );
};

export default Layout;
