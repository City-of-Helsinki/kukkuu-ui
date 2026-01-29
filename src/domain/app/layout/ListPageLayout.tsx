import { ReactNode } from 'react';
import { Container, IconArrowLeft, IconSize } from 'hds-react';
import { Link, LinkProps } from 'react-router';
import { useTranslation } from 'react-i18next';

import Text from '../../../common/components/text/Text';
import PageMeta from './utilityComponents/PageMeta';
import styles from './listPageLayout.module.scss';

type Props = {
  children: ReactNode;
  title?: string;
  description?: string;
};

function ListPageLayout({ children, title, description }: Props) {
  return (
    <>
      <PageMeta title={title} description={description} />
      <div className={styles.wrapper}>
        <Container role="main" className={styles.container}>
          {children}
        </Container>
      </div>
    </>
  );
}

type ListPageLayoutHeaderProps = {
  title: string;
  content?: ReactNode;
  actions?: ReactNode;
  backButtonHref?: LinkProps['to'];
};

function ListPageLayoutHeader({
  title,
  content,
  actions,
  backButtonHref,
}: ListPageLayoutHeaderProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.header}>
        {backButtonHref && (
          <div className={styles.headerBackButtonContainer}>
            <Link
              aria-label={t('common.backButton.label')}
              className={styles.headerBackButton}
              to={backButtonHref}
            >
              <IconArrowLeft size={IconSize.Small} />
            </Link>
          </div>
        )}
        <Text variant="h1" className={styles.headerTitle}>
          {title}
        </Text>
        {content && <div className={styles.headerContent}>{content}</div>}
        {actions && <div className={styles.headerActions}>{actions}</div>}
      </div>
    </>
  );
}

ListPageLayout.Header = ListPageLayoutHeader;

export default ListPageLayout;
