import { QueryResult } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import CultureKidsImage from '../../assets/images/Culture_kids_transparent@2x.png';
import useGetPathname from '../../common/route/utils/useGetPathname';
import List from '../../common/components/list/List';
import Page from '../app/layout/utilityComponents/Page';
import HeroLayout from '../app/layout/utilityComponents/HeroLayout';
import { EventGroupQuery } from '../api/generatedTypes/graphql';
import { nlToParagraph } from '../../common/commonUtils';
import RelayList from '../api/relayList';
import EventCard from '../event/eventCard/EventCard';
import styles from './eventGroup.module.scss';
import { EventNode } from './types/EventGroupQueryTypes';
const EventList = RelayList<EventNode>();

type Props = {
  query: QueryResult<EventGroupQuery>;
  childId: string;
};

const EventGroup = ({ query: { loading, error, data }, childId }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const getPathname = useGetPathname();

  const eventGroup = data?.eventGroup;
  const isReady = !loading && Boolean(eventGroup);

  return (
    <Page
      title={eventGroup?.name || ''}
      error={Boolean(error)}
      isReady={isReady}
      isLoading={loading}
    >
      <HeroLayout backTo={getPathname(`/profile/child/${childId}`)}>
        <div className={styles.container}>
          <img
            className={styles.eventGroupDecoration}
            src={CultureKidsImage}
            alt=""
          />
          <div className={styles.eventGroupDetails}>
            <h1 className={styles.title}>{eventGroup?.name}</h1>
            {eventGroup?.description && nlToParagraph(eventGroup?.description)}
          </div>
          <List
            variant="spacing-layout-2-xs"
            items={EventList(eventGroup?.events).items.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                action={() => {
                  navigate(
                    getPathname(`/profile/child/${childId}/event/${event.id}`)
                  );
                }}
                actionText={
                  event.canChildEnroll
                    ? t(
                        'profile.child.detail.availableEvent.readMoreAndEnrolButton'
                      )
                    : t('profile.child.detail.availableEvent.readMoreButton')
                }
              />
            ))}
          />
        </div>
      </HeroLayout>
    </Page>
  );
};

export default EventGroup;
