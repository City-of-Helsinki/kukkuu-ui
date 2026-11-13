import { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'hds-react';
import classNames from 'classnames';

import styles from './footer.module.scss';
import {
  isCimodeIndicatorRequested,
  setCimodeIndicatorRequested,
  CIMODE_CHANGE_EVENT,
  CIMODE_INDICATOR_ELEMENT_ID,
} from '../../../common/translation/cimode/cimodeUtils';

type CimodeToggleProps = {
  // Provided by HDSFooter.Link when used with its `as` prop
  className?: string;
};

const CimodeToggle: FunctionComponent<CimodeToggleProps> = ({ className }) => {
  const { t } = useTranslation();
  const [indicatorRequested, setIndicatorRequested] = useState(
    isCimodeIndicatorRequested
  );

  useEffect(() => {
    const handleCimodeChange = () => {
      setIndicatorRequested(isCimodeIndicatorRequested());
    };
    window.addEventListener(CIMODE_CHANGE_EVENT, handleCimodeChange);
    return () => {
      window.removeEventListener(CIMODE_CHANGE_EVENT, handleCimodeChange);
    };
  }, []);

  const handleToggleCimode = () => {
    setCimodeIndicatorRequested(!indicatorRequested);
  };

  return (
    <div className={classNames(className, styles.cimodeContainer)}>
      <button
        type="button"
        className={styles.cimodeButton}
        onClick={handleToggleCimode}
        data-testid="footer-cimode-button"
        aria-label={
          indicatorRequested
            ? t('footer.cimodeAriaClose')
            : t('footer.cimodeAriaOpen')
        }
        aria-expanded={indicatorRequested}
        aria-controls={CIMODE_INDICATOR_ELEMENT_ID}
      >
        {indicatorRequested ? t('footer.cimodeHide') : t('footer.cimode')}
      </button>
      <Tooltip
        small
        placement="top"
        buttonClassName={styles.tooltipButton}
        tooltipLabel={t('footer.cimodeTooltipLabel')}
      >
        {t('footer.cimodeTooltip')}
      </Tooltip>
    </div>
  );
};

export default CimodeToggle;
