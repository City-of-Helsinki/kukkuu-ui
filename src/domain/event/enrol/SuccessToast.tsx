import { FunctionComponent, useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import styles from './successToast.module.scss';
import Icon from '../../../common/components/icon/Icon';
import { justEnrolled } from '../state/EventActions';
import { justEnrolledSelector } from '../state/EventSelectors';
import { publicSvgIconPaths } from '../../../public_files';
import { a11nHandleKeyPress } from '../../../common/accessibility/keyboard';

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
  const handleOnKeyPress = a11nHandleKeyPress(handleOnClick);

  return (
    <CSSTransition
      className={styles.successToast}
      onClick={handleOnClick}
      onKeyPress={handleOnKeyPress}
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
        onClick={handleOnClick}
        onKeyPress={handleOnKeyPress}
        role="button"
        tabIndex={0}
      >
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
