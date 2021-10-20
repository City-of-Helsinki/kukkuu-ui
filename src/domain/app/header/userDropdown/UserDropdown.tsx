import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useMatomo } from '@datapunt/matomo-tracker-react';

import Dropdown, {
  DropdownOption,
} from '../../../../common/components/dropdown/Dropdown';
import personIcon from '../../../../assets/icons/svg/person.svg';
import { isAuthenticatedSelector } from '../../../auth/state/AuthenticationSelectors';
import { loginTunnistamo } from '../../../auth/authenticate';
import useLogout from '../../../auth/useLogout';
import UserMenu from '../userMenu/UserMenu';
import useProfile from '../../../profile/hooks/useProfile';

type DropdownType =
  | 'logged_out'
  | 'logged_in_with_profile'
  | 'logged_in_without_profile';

function getDropdownType(
  isAuthenticated: boolean,
  hasProfile: boolean
): DropdownType {
  if (isAuthenticated && !hasProfile) {
    return 'logged_in_without_profile';
  }

  if (isAuthenticated && hasProfile) {
    return 'logged_in_with_profile';
  }

  return 'logged_out';
}

export interface UserDropdownProps {
  isSmallScreen: boolean;
}

const UserDropdown = ({ isSmallScreen }: UserDropdownProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const doLogout = useLogout();

  // Skip the redirect to the short registration form when using profile
  // here. Because the menu is used on all pages, it's difficult to
  // control redirects. Previously this hook call would redirect users
  // away from the registration form, which is a page where we do not
  // want to for this check to take place.
  const { loading, data } = useProfile(true);
  const { trackEvent } = useMatomo();

  if (loading) return <></>;

  const hasProfile = Boolean(data?.id);
  const dropdownType = getDropdownType(isAuthenticated, hasProfile);

  const logout = {
    label: t('authentication.logout.text'),
    id: 'logoutButton',
    onClick: () => {
      doLogout();
    },
  };

  const user = {
    id: 'userButton',
    label: data?.firstName
      ? data?.firstName
      : t('navbar.profileDropdown.profile.text'),
    icon: personIcon,
    iconLabel: t('navbar.profileDropdown.icon.label'),
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

  const getDropdownOptions = (type: DropdownType): DropdownOption[] => {
    switch (type) {
      case 'logged_in_with_profile':
        return [user, profile, logout];
      case 'logged_in_without_profile':
        return [logout];
      case 'logged_out':
      default:
        return [login];
    }
  };

  const getMobileOptions = (type: DropdownType): DropdownOption[] => {
    switch (type) {
      case 'logged_in_with_profile':
        return [frontPage, profile, logout];
      case 'logged_in_without_profile':
        return [frontPage, logout];
      case 'logged_out':
      default:
        return [frontPage, login];
    }
  };

  if (!isSmallScreen) {
    const dropdownOptions = getDropdownOptions(dropdownType);

    return <Dropdown options={dropdownOptions} />;
  } else {
    const userMenuOptions = getMobileOptions(dropdownType);

    return <UserMenu options={userMenuOptions} />;
  }
};

export default UserDropdown;
