import React, { ReactComponentElement, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import LoadingSpinner from '../../../../common/components/spinner/LoadingSpinner';
import InfoTemplate from './InfoTemplate';
import PageMeta from './PageMeta';

type Props = {
  title: string;
  children: ReactElement;
  error:
    | boolean
    | {
        name: string;
        description: string;
      };
  isLoading?: boolean;
  isReady?: boolean;
  layout?: ReactComponentElement<'div'>;
};

const Page = ({ title, children, error, isLoading, isReady }: Props) => {
  const { t } = useTranslation();

  const isGenericError = !isLoading && error === true;
  const isError = !isLoading && !isGenericError && error !== false && error;

  return (
    <>
      <PageMeta title={title} />
      {isLoading && <LoadingSpinner isLoading={isLoading} />}
      {isGenericError && (
        <InfoTemplate
          title={t('common.error.title')}
          description={t('common.error.description')}
        />
      )}
      {isError && (
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        <InfoTemplate title={error.name} description={error.description} />
      )}
      {!isGenericError && !isError && !isLoading && isReady && children}
    </>
  );
};

export default Page;
