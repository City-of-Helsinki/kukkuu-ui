import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { IconPlus } from 'hds-react';

import {
  ProfileQuery,
  UpdateChildMutationInput,
} from '../../api/generatedTypes/graphql';
import Button from '../../../common/components/button/Button';
import LoadingSpinner from '../../../common/components/spinner/LoadingSpinner';
import Text from '../../../common/components/text/Text';
import List from '../../../common/components/list/List';
import AddNewChildFormModal from '../../registration/modal/AddNewChildFormModal';
import { addChildMutation } from '../../child/mutation/ChildMutation';
import { getSupportedChildData } from '../../child/ChildUtils';
import profileQuery from '../queries/ProfileQuery';
import useProfile, { ProfileQueryResult } from '../hooks/useProfile';
import { getProjectsFromProfileQuery } from '../ProfileUtil';
import ProfileChild from './child/ProfileChild';
import styles from './profileChildrenList.module.scss';

type Children = NonNullable<ProfileQuery['myProfile']>['children'];

function getChildrenFromProfile({
  data,
}: ProfileQueryResult): Children | null | undefined {
  return data?.children;
}

const ProfileChildrenList = () => {
  const { t } = useTranslation();
  const children = getChildrenFromProfile(useProfile());
  const [isOpen, setIsOpen] = useState(false);
  const [addChild, { loading: mutationLoading }] = useMutation(
    addChildMutation,
    {
      refetchQueries: [{ query: profileQuery }],
    }
  );
  const { trackEvent } = useMatomo();

  if (mutationLoading) return <LoadingSpinner isLoading={true} />;

  return (
    <section className={styles.layout}>
      <Text variant="h2">{t('profile.heading')}</Text>
      {isOpen && (
        <AddNewChildFormModal
          setIsOpen={setIsOpen}
          addChild={(payload) => {
            const supportedChildData: Omit<UpdateChildMutationInput, 'id'> =
              getSupportedChildData(payload);
            addChild({ variables: { input: supportedChildData } })
              .then(() => {
                trackEvent({ category: 'action', action: 'Add child' });
              })
              .catch((error) => {
                toast.error(t('profile.addChildMutation.errorMessage'));
                Sentry.captureException(error);
              });
          }}
        />
      )}
      {children?.edges ? (
        <List
          variant="spacing-layout-xs"
          items={getProjectsFromProfileQuery(children).map((project) => (
            <React.Fragment key={project.id}>
              <Text as="h3" variant="body-xl" className={styles.projectTitle}>
                {t('profile.message.projectDescription', {
                  projectYear: project.year,
                  projectName: project.name,
                  // Try to find amount of organizers by analyzing the name.
                  // Very brittle. Can easily break when new languages are
                  // added.
                  count: project.name?.split(/,|ja|and|och/)?.length ?? 0,
                })}
              </Text>
              <List
                variant="spacing-layout-2-xs"
                items={children.edges.map((childEdge) => {
                  const child = childEdge?.node;
                  const childYear = childEdge?.node?.project.year;
                  const projectYear = project?.year;

                  return child &&
                    childYear &&
                    projectYear &&
                    childYear === projectYear ? (
                    <ProfileChild key={child.id} child={child} />
                  ) : null;
                })}
              />
            </React.Fragment>
          ))}
        />
      ) : (
        <div className={styles.noChild}>
          <p>{t('profile.children.noChild.text')}</p>
        </div>
      )}
      <Button
        variant="secondary"
        aria-label={t('child.form.modal.add.label')}
        iconLeft={<IconPlus />}
        onClick={() => setIsOpen(true)}
      >
        {t('child.form.modal.add.label')}
      </Button>
    </section>
  );
};

export default ProfileChildrenList;
