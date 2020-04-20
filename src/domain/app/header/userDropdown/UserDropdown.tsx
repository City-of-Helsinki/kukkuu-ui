import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useMatomo } from '@datapunt/matomo-tracker-react';

import personIcon from '../../../../assets/icons/svg/person.svg';
import Dropdown from '../../../../common/components/dropdown/Dropdown';
import { isAuthenticatedSelector } from '../../../auth/state/AuthenticationSelectors';
import { profileSelector } from '../../../profile/state/ProfileSelectors';
import { loginTunnistamo, logoutTunnistamo } from '../../../auth/authenticate';
import UserMenu from '../userMenu/UserMenu';
import { flushAllState } from '../../../auth/state/AuthenticationUtils';

export interface UserDropdownProps {
  isSmallScreen?: boolean;
}

const UserDropdown: FunctionComponent<UserDropdownProps> = ({
  isSmallScreen,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const profileData = useSelector(profileSelector);
  const { trackEvent } = useMatomo();

  const logout = {
    label: t('authentication.logout.text'),
    id: 'logoutButton',
    onClick: () => {
      trackEvent({ category: 'action', action: 'Log out' });

      // Flush all cached state
      flushAllState({});

      // Log out;
      logoutTunnistamo();
    },
  };

  const user = {
    id: 'userButton',
    label: profileData?.firstName || t('navbar.profileDropdown.profile.text'),
    icon: personIcon,
  };

  const frontPage = {
    id: 'frontPageButton',
    label: t('navbar.smallScreenMenu.homepageLinkText'),
    onClick: () => history.push('/'),
  };

  const profile = {
    id: 'profileButton',
    label: t('navbar.profileDropdown.profile.text'),
    onClick: () => {
      history.push('/profile');
    },
  };

  const login = {
    id: 'loginButton',
    label: t('authentication.login.text'),
    icon: personIcon,
    onClick: () => {
      trackEvent({ category: 'action', action: 'Log in' });
      loginTunnistamo();
    },
  };

  if (!isSmallScreen) {
    const dropdownOptions = isAuthenticated ? [user, profile, logout] : [login];
    return <Dropdown options={dropdownOptions} />;
  } else {
    const userMenuOptions = isAuthenticated
      ? [frontPage, profile, logout]
      : [frontPage, login];
    return <UserMenu options={userMenuOptions} />;
  }
};

export default UserDropdown;
