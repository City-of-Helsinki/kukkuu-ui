import * as React from 'react';
import classnames from 'classnames';

import styles from './instructionCard.module.scss';
import Icon from '../../../common/components/icon/Icon';
import { PublicSvgIconPath } from '../../../public_files';

export type CircleVariant = 'yellow' | 'silver';

export interface InstructionCardProps {
  icon: PublicSvgIconPath;
  circleVariant: CircleVariant;
  title: string;
  text: string;
  className?: string;
}

const InstructionCard: React.FC<InstructionCardProps> = ({
  icon,
  circleVariant,
  title,
  text,
  className,
}) => {
  return (
    <div className={classnames(styles.card, className)}>
      <div className={classnames(styles.iconWrapper, styles[circleVariant])}>
        <Icon src={icon} className={styles.icon} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
};

export default InstructionCard;
