import {
  Header,
  IconSignin,
  IconSignout,
  useAuthenticatedUser,
  useOidcClient,
} from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { toast } from 'react-toastify';

import useGetPathname from '../../../common/route/utils/useGetPathname';
import styles from './userNavigation.module.scss';
import useLogout from '../../auth/useLogout';
import { useProfileContext } from '../../profile/hooks/useProfileContext';
import AppConfig from '../AppConfig';
import {
  closeMobileMenu,
  getUserDisplayInfo,
  type OidcProfileLike,
} from './navigationUtils';
import { SkeletonLine } from '../../../common/components/skeleton/CmsSkeleton';

export type UserNavigationProps = {
  fixedRightPosition?: boolean;
  fullWidth?: boolean;
  isNavLoading?: boolean;
};

function UserNavigation({
  fixedRightPosition = true,
  fullWidth,
  isNavLoading,
}: UserNavigationProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, login } = useOidcClient();
  const oidcUser = useAuthenticatedUser();
  const logout = useLogout();
  const isLoggedIn = isAuthenticated();
  const getPathname = useGetPathname();
  const { profile } = useProfileContext();
  const { trackEvent } = useMatomo();

  if (!isLoggedIn) {
    const loginLabel = t('authentication.login.shortText');
    return (
      <>
        <Header.ActionBarItem
          id="signinButton"
          key="signinButton"
          icon={<IconSignin />}
          label={loginLabel}
          closeIcon={<IconSignin />}
          closeLabel={loginLabel}
          fixedRightPosition={fixedRightPosition}
          fullWidth={fullWidth}
          preventButtonResize
          className={styles.signInActionBarItem}
          onClick={() => {
            closeMobileMenu();
            trackEvent({ category: 'action', action: 'Log in' });
            login();
          }}
        />
        {fullWidth && isNavLoading && (
          <div
            className={styles.mobileNavSkeleton}
            data-testid="mobile-nav-skeleton"
            aria-hidden="true"
          >
            <div className={styles.mobileNavSkeletonItem}>
              <SkeletonLine width="65%" height="1.5rem" />
            </div>
            <div className={styles.mobileNavSkeletonItem}>
              <SkeletonLine width="80%" height="1.5rem" />
            </div>
            <div className={styles.mobileNavSkeletonItem}>
              <SkeletonLine width="55%" height="1.5rem" />
            </div>
            <div className={styles.mobileNavSkeletonItem}>
              <SkeletonLine width="70%" height="1.5rem" />
            </div>
          </div>
        )}
      </>
    );
  }

  const { fullName, initials } = getUserDisplayInfo(
    profile,
    oidcUser?.profile as OidcProfileLike
  );
  const displayLabel = fullName || t('navbar.profileDropdown.icon.label');

  return (
    <>
      <Header.ActionBarItem
        id="userDropdownButton"
        key="userDropdownButton"
        label={displayLabel}
        avatar={initials || undefined}
        fixedRightPosition={fixedRightPosition}
        fullWidth={fullWidth}
        className={styles.userDropdownActionBarItem}
        dropdownClassName={styles.userDropdown}
      >
        <Header.ActionBarSubItem
          id="profileButton"
          label={t('navbar.profileDropdown.profile.text')}
          onClick={() => {
            closeMobileMenu();
            const result = navigate(getPathname('/profile'));
            if (result) {
              result.catch(() => toast.error(t('navigation.error')));
            }
          }}
        />
        <Header.ActionBarSubItem
          id="helsinkiProfileButton"
          label={t('navbar.profileDropdown.helsinkiProfile.text')}
          external
          openInExternalDomainAriaLabel={t(
            'common.openInExternalDomainAriaLabel'
          )}
          onClick={() => {
            closeMobileMenu();
            globalThis.window?.open(
              AppConfig.helsinkiProfileUrl,
              '_blank',
              'noopener,noreferrer'
            );
          }}
        />
        <Header.ActionBarSubItem
          id="logoutButton"
          label={t('authentication.logout.text')}
          iconEnd={<IconSignout />}
          bold
          onClick={() => {
            closeMobileMenu();
            logout();
          }}
        />
      </Header.ActionBarItem>
      {fullWidth && isNavLoading && (
        <div
          className={styles.mobileNavSkeleton}
          data-testid="mobile-nav-skeleton"
          aria-hidden="true"
        >
          <div className={styles.mobileNavSkeletonItem}>
            <SkeletonLine width="65%" height="1.5rem" />
          </div>
          <div className={styles.mobileNavSkeletonItem}>
            <SkeletonLine width="80%" height="1.5rem" />
          </div>
          <div className={styles.mobileNavSkeletonItem}>
            <SkeletonLine width="55%" height="1.5rem" />
          </div>
          <div className={styles.mobileNavSkeletonItem}>
            <SkeletonLine width="70%" height="1.5rem" />
          </div>
        </div>
      )}
    </>
  );
}

export default UserNavigation;
