import { useTranslation } from 'react-i18next';

import styles from './ticketmasterInfo.module.scss';
import Text from '../../../common/components/text/Text';

const TicketMasterInfo = () => {
  const { t } = useTranslation();

  return (
    <Text className={styles.ticketMasterInfo}>
      {t('profileEventList.message.ticketMasterInfo')}
    </Text>
  );
};

export default TicketMasterInfo;
