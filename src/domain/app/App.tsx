import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';

import { isSessionExpiredPromptOpenSelector } from './state/ui/UISelectors';
import SessionAlert from './sessionAlert/SessionAlert';
import PageLayout from './layout/PageLayout';
import useHashAnchorLinks from './useHashAnchorLinks';
import AppTitleAnnouncer from './AppTitleAnnouncer';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  useHashAnchorLinks();

  const isSessionPromptOpen = useSelector(isSessionExpiredPromptOpenSelector);
  return (
    <PageLayout>
      <AppTitleAnnouncer />
      {isSessionPromptOpen && <SessionAlert isOpen={isSessionPromptOpen} />}
      <AppRoutes />
    </PageLayout>
  );
};

export default App;
