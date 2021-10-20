import PageWrapper from '../../app/layout/PageWrapper';
import InfoTemplate from './utilityComponents/InfoTemplate';

type Props = {
  title: string;
  description: string;
  icon?: string;
  callToAction?: {
    label: string;
    onClick: () => void;
  };
};

const InfoPageLayout = (props: Props) => {
  return (
    <PageWrapper>
      <InfoTemplate {...props} />
    </PageWrapper>
  );
};

export default InfoPageLayout;
