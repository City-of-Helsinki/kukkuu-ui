import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import personIcon from '../../../../assets/icons/svg/person.svg';
import Dropdown from '../../../../common/components/dropdown/Dropdown';
import { isAuthenticatedSelector } from '../../../auth/state/AuthenticationSelectors';
import { profileSelector } from '../../../profile/state/ProfileSelectors';
import { loginTunnistamo, logoutTunnistamo } from '../../../auth/authenticate';
import UserMenu from '../userMenu/UserMenu';
import { flushData } from '../../state/AppStoreUtils';

export interface UserDropdownProps {
  isSmallScreen?: boolean;
}

const UserDropdown: React.FunctionComponent<UserDropdownProps> = ({
  isSmallScreen,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const profileData = useSelector(profileSelector);

  const logout = {
    label: t('authentication.logout.text'),
    onClick: () => {
      // Flush all persisted state and localStorage
      flushData();

      // Log out
      logoutTunnistamo();
    },
  };

  const user = {
    label:
      (profileData && profileData.firstName) ||
      // This text should never be displayed - defensive programming:
      t('navbar.profileDropdown.profile.text'),
    icon: personIcon,
    skipItem: true,
  };

  const frontPage = {
    label: t('navbar.smallScreenMenu.homepageLinkText'),
    onClick: () => history.push('/'),
  };

  const profile = {
    label: t('navbar.profileDropdown.profile.text'),
    onClick: () => {
      history.push('/profile');
    },
  };

  const login = {
    label: t('authentication.login.text'),
    icon: personIcon,
    onClick: () => loginTunnistamo(),
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
