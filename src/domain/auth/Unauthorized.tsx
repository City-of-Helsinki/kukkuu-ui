import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { IconSignin } from 'hds-react/icons';

import InfoPageLayout from '../app/layout/InfoPageLayout';
import { loginTunnistamo } from './authenticate';
import styles from './unauthorized.module.scss';
import adultFaceHappyIcon from '../../assets/icons/svg/adultFaceHappyTransparent.svg';

const LoginButton = () => {
  const { t } = useTranslation();
  return (
    <>
      {t('authentication.login.shortText')} <IconSignin size="s" />
    </>
  );
};

const Unauthorized = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const nextPath = searchParams.get('next');

  const handleCallToActionClick = () => {
    loginTunnistamo(nextPath ?? undefined);
  };

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
