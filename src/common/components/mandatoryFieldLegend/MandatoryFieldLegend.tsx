import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { FunctionComponent } from 'react';

import styles from './mandatoryFieldLegend.module.scss';

export type MandatoryFieldLegendProps = {
  position: 'left' | 'right';
};

const MandatoryFieldLegend: FunctionComponent<MandatoryFieldLegendProps> = ({
  position,
}: MandatoryFieldLegendProps) => {
  const { t } = useTranslation();
  return (
    <p className={styles[position]} data-testid="mandatory-field-legend">
      <span className={styles.bold}>*</span>
      <span> {t('requiredLabelSuffix')}</span>
    </p>
  );
};

export default MandatoryFieldLegend;
