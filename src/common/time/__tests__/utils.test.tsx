import { toZeroBasedMonth } from '../utils';

it('Converts human-readable month to zero based', () => {
  const month = 12;
  expect(toZeroBasedMonth(month)).toEqual(11);
});

it('Converts human-readable string month to zero based integer', () => {
  const month = '1';
  expect(toZeroBasedMonth(month)).toEqual(0);
});
