import { FunctionComponent, useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import styles from './successToast.module.scss';
import Icon from '../../../common/components/icon/Icon';
import { justEnrolled } from '../state/EventActions';
import { justEnrolledSelector } from '../state/EventSelectors';
import { publicSvgIconPaths } from '../../../public_files';

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

  const handleOnClick = () => setShowJustEnrolled(false);

  return (
    <CSSTransition
      className={styles.successToast}
      onClick={handleOnClick}
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
      {/* FIXME: Make SuccessToast accessible with keyboard & re-enable linting: */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div onClick={handleOnClick}>
        <Icon src={publicSvgIconPaths['tada']} className={styles.tadaIcon} />
        <div>
          <h1>{t('enrollment.successToast.heading')}</h1>
          <p>{t('enrollment.successToast.paragraph')}</p>
        </div>
      </div>
    </CSSTransition>
  );
};
export default SuccessToast;
