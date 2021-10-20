import { FunctionComponent } from 'react';

import { nlToParagraph } from '../../commonUtils';

interface ParagraphProps {
  text: string;
}
const Paragraph: FunctionComponent<ParagraphProps> = ({ text }) => {
  return <>{nlToParagraph(text)}</>;
};

export default Paragraph;
