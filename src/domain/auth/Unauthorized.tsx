import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router';
import { IconSignin, useOidcClient, IconSize } from 'hds-react';
import React from 'react';

import InfoPageLayout from '../app/layout/InfoPageLayout';
import styles from './unauthorized.module.scss';
import useGetPathname from '../../common/route/utils/useGetPathname';
import { publicSvgIconPaths } from '../../public_files';

const LoginButton = () => {
  const { t } = useTranslation();
  return (
    <>
      {t('authentication.login.shortText')} <IconSignin size={IconSize.Small} />
    </>
  );
};

const Unauthorized = () => {
  const { isAuthenticated, login } = useOidcClient();
  const navigate = useNavigate();
  const getPathname = useGetPathname();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const nextPath = searchParams.get('next');

  const handleCallToActionClick = () => {
    login({ url_state: `next=${nextPath}` });
  };

  React.useEffect(() => {
    if (isAuthenticated()) {
      navigate(nextPath || getPathname('/profile'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <InfoPageLayout
      icon={publicSvgIconPaths['adultFaceHappyTransparent']}
      classes={styles.loginButtonTemplate}
      title={t('authentication.login.text')}
      callToAction={{
        label: <LoginButton />,
        onClick: handleCallToActionClick,
      }}
    />
  );
};

export default Unauthorized;
