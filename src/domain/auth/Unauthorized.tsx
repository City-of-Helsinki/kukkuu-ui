import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IconSignin } from 'hds-react/icons';
import { useOidcClient } from 'hds-react';
import React from 'react';

import InfoPageLayout from '../app/layout/InfoPageLayout';
import styles from './unauthorized.module.scss';
import adultFaceHappyIcon from '../../assets/icons/svg/adultFaceHappyTransparent.svg';
import useGetPathname from '../../common/route/utils/useGetPathname';

const LoginButton = () => {
  const { t } = useTranslation();
  return (
    <>
      {t('authentication.login.shortText')} <IconSignin size="s" />
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
      icon={adultFaceHappyIcon}
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
