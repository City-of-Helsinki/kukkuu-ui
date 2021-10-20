import { FunctionComponent, useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import styles from './successToast.module.scss';
import tada from '../../../assets/icons/svg/tada.svg';
import Icon from '../../../common/components/icon/Icon';
import { justEnrolled } from '../state/EventActions';
import { justEnrolledSelector } from '../state/EventSelectors';

const SuccessToast: FunctionComponent = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [showJustEnrolled, setShowJustEnrolled] = useState(false);
  const isJustEnrolled = useSelector(justEnrolledSelector);

  useEffect(() => {
    setShowJustEnrolled(isJustEnrolled);
  }, [isJustEnrolled]);

  // eslint-disable-next-line no-undef
  let timer: NodeJS.Timeout;
  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  });

  return (
    <CSSTransition
      className={styles.successToast}
      onClick={() => {
        setShowJustEnrolled(false);
      }}
      in={showJustEnrolled}
      timeout={{ appear: 300, enter: 300, exit: 300 }}
      classNames={{ ...styles }}
      onEntered={() => {
        timer = setTimeout(() => {
          setShowJustEnrolled(false);
        }, 3000);
      }}
      onExited={() => {
        clearTimeout(timer);
        dispatch(justEnrolled());
      }}
      unmountOnExit
    >
      <div
        onClick={() => {
          setShowJustEnrolled(false);
        }}
      >
        <Icon src={tada} className={styles.tadaIcon} />
        <div>
          <h1>{t('enrollment.successToast.heading')}</h1>
          <p>{t('enrollment.successToast.paragraph')}</p>
        </div>
      </div>
    </CSSTransition>
  );
};
export default SuccessToast;
