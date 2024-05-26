import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Card from '../../../common/components/card/Card';
import PlaceholderImage from '../../../common/components/placeholderImage/PlaceholderImage';
//import styles from './additionalNotesCard.module.scss';

interface AdditionalNotesCardProps {
  title?: string;
}

const AdditionalNotesCard: FunctionComponent<AdditionalNotesCardProps> = ({
  title,
}) => {
  const { t } = useTranslation();
  const [isViewMode, setIsViewMode] = useState<boolean>(true);

  const handleNotesAction = () => {
    if (isViewMode) {
      setIsViewMode(false);
    } else {
      // save changes

      // if success
      setIsViewMode(true);
      // show toast
    }
  };

  return (
    <Card
      alt={''}
      imageElement={<PlaceholderImage />}
      title={title || ''}
      actionText={''}
      primaryAction={handleNotesAction}
      primaryActionText={t(
        `profile.additionalInfo.${isViewMode ? 'edit' : 'save'}`
      )}
      withAction={false}
      withCardClickAction={false}
    >
      {isViewMode ? <div>view mode</div> : <div>edit mode</div>}
    </Card>
  );
};

export default AdditionalNotesCard;
