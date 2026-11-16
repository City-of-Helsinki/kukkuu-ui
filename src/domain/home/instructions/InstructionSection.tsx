import * as React from 'react';
import classnames from 'classnames';

import styles from './instructionSection.module.scss';
import InstructionCard, { InstructionCardProps } from './InstructionCard';

export interface InstructionSectionProps {
  heading: string;
  cards: Omit<InstructionCardProps, 'className'>[];
  action?: React.ReactNode;
  className?: string;
}

const InstructionSection: React.FC<InstructionSectionProps> = ({
  heading,
  cards,
  action,
  className,
}) => {
  return (
    <section className={classnames(styles.section, className)}>
      <h2>{heading}</h2>
      <div className={styles.grid}>
        {cards.map((card) => (
          <InstructionCard key={card.title} {...card} />
        ))}
      </div>
      {action && <div className={styles.actionWrapper}>{action}</div>}
    </section>
  );
};

export default InstructionSection;
