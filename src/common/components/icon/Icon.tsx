import * as React from 'react';

import styles from './icon.module.scss';

interface IconProps {
  src: string;
  alt: string;
}

const Icon: React.FunctionComponent<IconProps> = ({ src, alt, ...rest }) => {
  return (
    <div className={styles.imgWrapper}>
      <img src={src} alt={alt} {...rest} />
    </div>
  );
};

export default Icon;
