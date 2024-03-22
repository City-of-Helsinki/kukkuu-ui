import React from 'react';
import classnames from 'classnames';

import Icon from '../../../../common/components/icon/Icon';
import styles from './simpleFormTemplate.module.scss';

export type SimpleFormTemplateProps = {
  title: string | React.ReactElement;
  description?: string | React.ReactElement;
  form: React.ReactElement;
  icon?: string | React.ReactElement;

  classes?: string;
};

const SimpleFormTemplate = ({
  title,
  description,
  form,
  icon,
  classes,
}: SimpleFormTemplateProps) => {
  return (
    <div className={classnames(styles.simpleFormPageLayout, classes)}>
      <h1 className={styles.simpleFormPageLayoutTitle}>{title}</h1>
      {typeof icon === 'string' ? (
        <Icon className={styles.simpleFormPageLayoutFace} src={icon} />
      ) : (
        icon
      )}
      {description && (
        <p className={styles.simpleFormPageLayoutDescription}>{description}</p>
      )}
      {form}
    </div>
  );
};

export default SimpleFormTemplate;
