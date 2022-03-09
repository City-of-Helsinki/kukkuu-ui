import { ReactElement } from 'react';

import homeTheaterIcon from '../../../assets/icons/svg/homeTheater.svg';
import Card from '../../../common/components/card/Card';
import Text from '../../../common/components/text/Text';
import styles from './eventCard.module.scss';

const PlaceholderImage = () => {
  return (
    <div className={styles.placeholderImage}>
      <img src={homeTheaterIcon} alt="" />
    </div>
  );
};

type Event = {
  id: string;
  image: string | null;
  imageAltText: string | null;
  name: string | null;
  shortDescription: string | null;
};

type Props = {
  event: Event;
  action: () => void;
  actionText: string;
  primaryAction?: 'visible' | 'hidden';
  focalContent?: ReactElement;
  imageElement?: ReactElement;
};

const EventCard = ({
  event: { image, imageAltText, name, shortDescription },
  action,
  actionText,
  primaryAction = 'visible',
  focalContent,
  imageElement,
}: Props) => {
  const isPrimaryActionVisible = primaryAction === 'visible';

  return (
    <Card
      imageSrc={image && !imageElement ? image : undefined}
      imageElement={imageElement || <PlaceholderImage />}
      alt={imageAltText || ''}
      title={name || ''}
      action={action}
      actionText={actionText}
      primaryAction={isPrimaryActionVisible ? action : undefined}
      primaryActionText={isPrimaryActionVisible ? actionText : undefined}
      focalContent={focalContent}
    >
      <Text>{shortDescription}</Text>
    </Card>
  );
};

export default EventCard;
