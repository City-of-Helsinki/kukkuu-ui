import React, { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { IconPlusCircle } from 'hds-react';

import { profileQuery_myProfile_children as Children } from '../../api/generatedTypes/profileQuery';
import styles from './profileChildrenList.module.scss';
import ProfileChild from './child/ProfileChild';
import AddNewChildFormModal from '../../registration/modal/AddNewChildFormModal';
import { addChildMutation } from '../../child/mutation/ChildMutation';
import { getSupportedChildData } from '../../child/ChildUtils';
import LoadingSpinner from '../../../common/components/spinner/LoadingSpinner';
import profileQuery from '../queries/ProfileQuery';
import useProfile, { ProfileQueryResult } from '../hooks/useProfile';
import { getProjectsFromProfileQuery } from '../ProfileUtil';
import { UpdateChildMutationInput } from '../../api/generatedTypes/globalTypes';
import Button from '../../../common/components/button/Button';

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
    <>
      <div className={styles.heading}>
        <h2>{t('profile.heading')}</h2>
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
      </div>

      <div className={styles.childrenList}>
        {children?.edges ? (
          <>
            {getProjectsFromProfileQuery(children).map((project) => (
              <Fragment key={project.id}>
                <div className={styles.thisYearPartner}>
                  <h3>
                    {project.year} {project.name}
                  </h3>
                </div>
                {children.edges.map((childEdge) => {
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
              </Fragment>
            ))}
          </>
        ) : (
          <div className={styles.noChild}>
            <p>{t('profile.children.noChild.text')}</p>
          </div>
        )}
      </div>
      <Button
        variant="supplementary"
        aria-label={t('child.form.modal.add.label')}
        className={styles.addChild}
        iconLeft={<IconPlusCircle />}
        onClick={() => setIsOpen(true)}
      >
        {t('child.form.modal.add.label')}
      </Button>
    </>
  );
};

export default ProfileChildrenList;
