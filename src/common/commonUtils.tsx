export const nlToParagraph = (text: string) => {
  return (text || '').split(/\r?\n/g).map((item, i) => <p key={i}>{item}</p>);
};
