import { Navigation, IconUser, IconSignout } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMatomo } from '@datapunt/matomo-tracker-react';

import useGetPathname from '../../../common/route/utils/useGetPathname';
import { isAuthenticatedSelector } from '../../auth/state/AuthenticationSelectors';
import { loginTunnistamo } from '../../auth/authenticate';
import useLogout from '../../auth/useLogout';
import useProfile from '../../profile/hooks/useProfile';

function UserNavigation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const doLogout = useLogout();
  const getPathname = useGetPathname();

  // Skip the redirect to the short registration form when using profile
  // here. Because the menu is used on all pages, it's difficult to
  // control redirects. Previously this hook call would redirect users
  // away from the registration form, which is a page where we do not
  // want to for this check to take place.
  const { loading, data } = useProfile(true);
  const { trackEvent } = useMatomo();

  if (loading) return <></>;

  const handleSignIn = () => {
    trackEvent({ category: 'action', action: 'Log in' });
    loginTunnistamo();
  };

  const userDropdownItems = [
    {
      included: isAuthenticated,
      id: 'profileButton',
      label: t('navbar.profileDropdown.profile.text'),
      icon: <IconUser />,
      onClick: () => {
        navigate(getPathname('/profile'));
      },
    },
    {
      included: true,
      label: t('authentication.logout.text'),
      id: 'logoutButton',
      icon: <IconSignout />,
      onClick: () => {
        doLogout();
      },
    },
  ].filter((item) => item.included);

  return (
    <Navigation.User
      buttonAriaLabel={t('header.userMenu.ariaLabelButton')}
      label={t('authentication.login.text')}
      userName={data?.firstName ?? t('navbar.profileDropdown.profile.text')}
      authenticated={isAuthenticated}
      onSignIn={handleSignIn}
    >
      {userDropdownItems.map((item) => (
        <Navigation.Item
          key={item.id}
          icon={item.icon}
          label={item.label}
          onClick={item.onClick}
          variant="supplementary"
        />
      ))}
    </Navigation.User>
  );
}

export default UserNavigation;
