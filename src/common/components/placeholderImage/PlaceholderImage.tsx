import { FunctionComponent } from 'react';

import styles from './placeholderImage.module.scss';
import { publicSvgIconPaths } from '../../../public_files';

const PlaceholderImage: FunctionComponent = () => {
  return (
    <div className={styles.placeholderImage}>
      <img src={publicSvgIconPaths['homeTheater']} alt="" />
    </div>
  );
};

export default PlaceholderImage;
