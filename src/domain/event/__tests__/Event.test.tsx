// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// FIXME: Fix types and re-enable Typescript checking by removing @ts-nocheck
import { getDateOptions, getTimeOptions } from '../EventUtils';

describe('Event', () => {
  // Test these utils separately so we do not need to mock the API.
  // Cover that with browser tests.
  describe('utilities', () => {
    it('getDateOptions should return a list of options without duplicates', () => {
      const occurrences = {
        edges: [
          { node: { id: '1', time: '2020-12-07' } },
          null,
          { node: { id: '1', time: '2020-12-07' } },
        ],
      };

      expect(getDateOptions(occurrences)).toMatchInlineSnapshot(`
        [
          {
            "key": "1",
            "label": "7.12.2020",
            "value": "2020-12-07",
          },
        ]
      `);
    });

    it('getTimeOptions should return an ordered list without duplicates', () => {
      const occurrences = {
        edges: [
          {
            node: {
              id: '1',
              time: new Date(2020, 11, 7, 10),
              event: { duration: 10 },
            },
          },
          null,
          {
            node: {
              id: '1',
              time: new Date(2020, 11, 7, 10),
              event: { duration: 10 },
            },
          },
          {
            node: {
              id: '1',
              time: new Date(2020, 11, 7, 8),
              event: { duration: 15 },
            },
          },
        ],
      };

      expect(getTimeOptions(occurrences)).toMatchInlineSnapshot(`
        [
          {
            "key": "1",
            "label": "08:00 - 08:15",
            "value": "08:00",
          },
          {
            "key": "1",
            "label": "10:00 - 10:10",
            "value": "10:00",
          },
        ]
      `);
    });
  });
});
