import { FunctionComponent, useState } from 'react';
import MarkdownEditor, { commands } from '@uiw/react-md-editor';
import MarkdownPreview from '@uiw/react-markdown-preview';
import rehypeSanitize from 'rehype-sanitize';
import { useTranslation } from 'react-i18next';

import Card from '../../../common/components/card/Card';
import PlaceholderImage from '../../../common/components/placeholderImage/PlaceholderImage';

interface AdditionalNotesCardProps {
  title?: string;
}

const AdditionalNotesCard: FunctionComponent<AdditionalNotesCardProps> = ({
  title,
}) => {
  const { t } = useTranslation();
  const [isViewMode, setIsViewMode] = useState<boolean>(true);
  const [markDown, setMarkDown] = useState<string | undefined>('');

  // todo: read query and update mutation

  const handleNotesAction = () => {
    if (isViewMode) {
      setIsViewMode(false);
    } else {
      // todo: save changes

      // todo: if success
      setIsViewMode(true);
      // todo: show toast if fail or success
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
        `profile.childNotes.${isViewMode ? 'edit' : 'save'}`
      )}
      withAction={false}
      withCardClickAction={false}
      imageFullHeight
    >
      {isViewMode ? (
        <MarkdownPreview
          source={markDown ? markDown : t('profile.childNotes.noNotes')}
        />
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
              commands.divider,
            ]}
            extraCommands={[]}
            highlightEnable={false}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
          />
        </div>
      )}
    </Card>
  );
};

export default AdditionalNotesCard;
