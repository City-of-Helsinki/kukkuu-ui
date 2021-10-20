import { FunctionComponent } from 'react';
import classnames from 'classnames';

import styles from './container.module.scss';

const Container: FunctionComponent<{
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={classnames(styles.container, className)}>{children}</div>
  );
};

export default Container;
