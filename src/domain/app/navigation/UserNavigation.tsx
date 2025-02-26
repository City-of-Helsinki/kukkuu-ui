import {
  Header,
  IconSignin,
  IconUser,
  IconSignout,
  IconCross,
  useOidcClient,
  IconLinkExternal,
} from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { toast } from 'react-toastify';

import Button from '../../../common/components/button/Button';
import useGetPathname from '../../../common/route/utils/useGetPathname';
import styles from './userNavigation.module.scss';
import useLogout from '../../auth/useLogout';
import { useProfileContext } from '../../profile/hooks/useProfileContext';
import AppConfig from '../AppConfig';

type UserNavigationItem = {
  id: string;
  label: string | JSX.Element;
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

const hiddenBelowSmallSpan = (text: string) => (
  <span className={styles.hideBelowSmall}>{text}</span>
);

function UserNavigation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, login } = useOidcClient();
  const logout = useLogout();
  const isLoggedIn = isAuthenticated();
  const getPathname = useGetPathname();
  const { profile } = useProfileContext();
  const { trackEvent } = useMatomo();

  const userDropdownButton: UserNavigationItem = {
    id: 'userDropdownButton',
    label: hiddenBelowSmallSpan(profile?.firstName ?? ''),
    icon: <IconUser />,
    closeIcon: <IconCross />,
    dropdownItems: [
      {
        id: 'profileButton',
        label: t('navbar.profileDropdown.profile.text'),
        icon: <IconUser />,
        onClick: () => {
          const result = navigate(getPathname('/profile'));
          if (result) result.catch(() => toast.error(t('navigation.error')));
        },
      },
      {
        id: 'helsinkiProfileButton',
        label: t('navbar.profileDropdown.helsinkiProfile.text'),
        icon: <IconLinkExternal />,
        onClick: () => {
          if (typeof window !== 'undefined') {
            window.open(
              AppConfig.helsinkiProfileUrl,
              '_blank',
              'noopener,noreferrer'
            );
          }
        },
      },
      {
        label: t('authentication.logout.text'),
        id: 'logoutButton',
        icon: <IconSignout />,
        onClick: () => logout(),
      },
    ],
  };

  const signInButton: UserNavigationItem = {
    id: 'signinButton',
    label: hiddenBelowSmallSpan(t('authentication.login.shortText')),
    icon: <IconSignin />,
    onClick: () => {
      trackEvent({ category: 'action', action: 'Log in' });
      login();
    },
    dropdownItems: [],
  };

  const item: UserNavigationItem = isLoggedIn
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
      preventButtonResize
      className={styles.list}
    >
      {item.dropdownItems.map((dropdownItem) => (
        <Button
          className={styles.userLink}
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
