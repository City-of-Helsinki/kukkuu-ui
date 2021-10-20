import { useTranslation } from 'react-i18next';

import styles from './homeVideo.module.scss';
import { getCurrentLanguage } from '../../../common/translation/TranslationUtils';

const HomeVideo = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = getCurrentLanguage(i18n);

  const videoSrc = `https://www.youtube.com/embed/${t(
    'home.video.youtubeId'
  )}?controls=0&fs=0&hl=${currentLanguage}&autoplay=1`;

  return (
    <section className={styles.wrapper}>
      <div className={styles.innerwrapper}>
        <div className={styles.embedContainer}>
          <iframe
            id="ytplayer"
            title="video"
            src={videoSrc}
            allowFullScreen
            frameBorder="0"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default HomeVideo;
