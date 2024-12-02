import { FunctionComponent } from 'react';

import styles from './placeholderImage.module.scss';

const PlaceholderImage: FunctionComponent = () => {
  return (
    <div className={styles.placeholderImage}>
      <img src={'/icons/svg/homeTheater.svg'} alt="" />
    </div>
  );
};

export default PlaceholderImage;
