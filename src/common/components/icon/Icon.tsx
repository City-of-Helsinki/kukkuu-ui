import * as React from 'react';
import classnames from 'classnames';

import styles from './icon.module.scss';
interface IconProps {
  src: string;
  alt: string;
  className?: string;
}

const Icon: React.FunctionComponent<IconProps> = ({
  src,
  alt,
  className,
  ...rest
}) => {
  return (
    <div className={classnames(styles.inputWrapper, className)}>
      <img src={src} alt={alt} {...rest} />
    </div>
  );
};

export default Icon;
