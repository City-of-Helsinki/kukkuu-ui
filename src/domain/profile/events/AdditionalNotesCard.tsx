import { FunctionComponent, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import MarkdownEditor, { commands } from '@uiw/react-md-editor';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';
import rehypeSanitize from 'rehype-sanitize';
import * as Sentry from '@sentry/browser';

import styles from './additionalNotesCard.module.scss';
import Card from '../../../common/components/card/Card';
import PlaceholderImage from '../../../common/components/placeholderImage/PlaceholderImage';
import {
  ChildNotesByIdQuery,
  UpdateChildNotesMutationPayloadFieldsFragment,
} from '../../api/generatedTypes/graphql';
import { childNotesByIdQuery } from '../../child/queries/ChildQueries';
import { editChildNotesMutation } from '../../child/mutation/ChildMutation';

interface AdditionalNotesCardProps {
  childId: string;
  title?: string;
}

const AdditionalNotesCard: FunctionComponent<AdditionalNotesCardProps> = ({
  title,
  childId,
}) => {
  const { t } = useTranslation();
  const [isViewMode, setIsViewMode] = useState<boolean>(true);
  const [markDown, setMarkDown] = useState<string | undefined>('');

  const { data } = useQuery<ChildNotesByIdQuery>(childNotesByIdQuery, {
    variables: {
      id: childId,
    },
  });

  const [editChildChildNotes] =
    useMutation<UpdateChildNotesMutationPayloadFieldsFragment>(
      editChildNotesMutation,
      {
        refetchQueries: [
          { query: childNotesByIdQuery, variables: { id: childId } },
        ],
      }
    );

  useEffect(() => {
    if (data?.childNotes) {
      setMarkDown(data.childNotes.notes);
    }
  }, [data]);

  const handleNotesAction = async () => {
    if (isViewMode) {
      setIsViewMode(false);
    } else {
      try {
        await editChildChildNotes({
          variables: {
            input: {
              childId,
              notes: DOMPurify.sanitize(markDown || ''),
            },
          },
        });
      } catch (error) {
        toast.error(t('profile.childNotes.errorMessage'));
        Sentry.captureException(error);
      }
      setIsViewMode(true);
    }
  };

  return (
    <Card
      alt={title || ''}
      imageElement={<PlaceholderImage />}
      title={title || ''}
      actionText={''}
      primaryAction={handleNotesAction}
      primaryActionText={t(
        `profile.childNotes.${isViewMode ? 'edit' : 'save'}`
      )}
      withAction={false}
      withCardClickAction={false}
      imageFullHeight
    >
      {isViewMode ? (
        <div className={styles.previewContainer}>
          <MarkdownPreview
            source={
              markDown
                ? DOMPurify.sanitize(markDown || '')
                : t('profile.childNotes.noNotes')
            }
          />
        </div>
      ) : (
        <div>
          <MarkdownEditor
            value={markDown}
            onChange={setMarkDown}
            height="200px"
            minHeight={200}
            commands={[
              commands.group(
                [
                  commands.title1,
                  commands.title2,
                  commands.title3,
                  commands.title4,
                  commands.title5,
                  commands.title6,
                ],
                {
                  name: t('profile.childNotes.titleGroup'),
                  groupName: t('profile.childNotes.titleGroup'),
                  buttonProps: {
                    'aria-label': t('profile.childNotes.titleAction'),
                  },
                }
              ),
              commands.checkedListCommand,
              commands.unorderedListCommand,
              commands.orderedListCommand,
              commands.divider,
              commands.hr,
            ]}
            extraCommands={[]}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
            highlightEnable={false}
          />
        </div>
      )}
    </Card>
  );
};

export default AdditionalNotesCard;
