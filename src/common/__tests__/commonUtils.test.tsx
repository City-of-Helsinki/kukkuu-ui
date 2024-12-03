import { nlToParagraph } from '../commonUtils';

it('converts CRLFs to brs', () => {
  const string = 'a\r\nb';
  expect(nlToParagraph(string)).toMatchSnapshot();
});

it('converts LFs to brs', () => {
  const string = 'a\nb';
  expect(nlToParagraph(string)).toMatchSnapshot();
});
