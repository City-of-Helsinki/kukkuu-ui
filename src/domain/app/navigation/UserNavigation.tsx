import {
  Header,
  IconSignin,
  IconUser,
  IconSignout,
  IconCross,
} from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMatomo } from '@jonkoops/matomo-tracker-react';

import Button from '../../../common/components/button/Button';
import useGetPathname from '../../../common/route/utils/useGetPathname';
import { isAuthenticatedSelector } from '../../auth/state/AuthenticationSelectors';
import { loginTunnistamo } from '../../auth/authenticate';
import useLogout from '../../auth/useLogout';
import useProfile from '../../profile/hooks/useProfile';

type UserNavigationItem = {
  id: string;
  label: string;
  icon: JSX.Element;
  closeIcon?: JSX.Element;
  closeLabel?: string;
  onClick?: () => void;
  dropdownItems: Array<{
    id: string;
    label: string;
    icon: JSX.Element;
    onClick: () => void;
  }>;
};

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

  const userDropdownButton: UserNavigationItem = {
    id: 'userDropdownButton',
    label: data?.firstName ?? '',
    icon: <IconUser />,
    closeIcon: <IconCross />,
    dropdownItems: [
      {
        id: 'profileButton',
        label: t('navbar.profileDropdown.profile.text'),
        icon: <IconUser />,
        onClick: () => navigate(getPathname('/profile')),
      },
      {
        label: t('authentication.logout.text'),
        id: 'logoutButton',
        icon: <IconSignout />,
        onClick: doLogout,
      },
    ],
  };

  const signInButton: UserNavigationItem = {
    id: 'signinButton',
    label: t('authentication.login.shortText'),
    icon: <IconSignin />,
    onClick: handleSignIn,
    dropdownItems: [],
  };

  const item: UserNavigationItem = isAuthenticated
    ? userDropdownButton
    : signInButton;

  return (
    <Header.ActionBarItem
      id={item.id}
      key={item.id}
      icon={item.icon}
      label={item.label}
      closeIcon={item.closeIcon ?? item.icon}
      closeLabel={item.closeLabel ?? item.label}
      onClick={item.onClick ?? undefined}
      fixedRightPosition
      preventButtonResize
    >
      {item.dropdownItems.map((dropdownItem) => (
        <Button
          id={dropdownItem.id}
          key={dropdownItem.id}
          iconLeft={dropdownItem.icon}
          onClick={dropdownItem.onClick}
          variant="dropdown"
        >
          {dropdownItem.label}
        </Button>
      ))}
    </Header.ActionBarItem>
  );
}

export default UserNavigation;
