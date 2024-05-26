import { FunctionComponent } from 'react';

import homeTheaterIcon from '../../../assets/icons/svg/homeTheater.svg';
import styles from './placeholderImage.module.scss';

const PlaceholderImage: FunctionComponent = () => {
  return (
    <div className={styles.placeholderImage}>
      <img src={homeTheaterIcon} alt="" />
    </div>
  );
};

export default PlaceholderImage;
