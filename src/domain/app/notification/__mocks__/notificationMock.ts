import { MockedResponse } from '@apollo/client/testing';

import notificationQuery from '../notificationQuery';

/**
 * This is a mock of the response from the notification query.
 * Data taken from production CMS query response, and cleaned/simplified.
 */
export const notificationQueryResponse = {
  data: {
    notification: {
      content:
        '<p>Kirjautuminen Kulttuurin kummilapset -palveluun on muuttunut 17.6.2024 alkaen.</p>',
      title: 'Huom.!',
      level: 'info',
      startDate: '2024-06-17T00:00:00+03:00',
      endDate: '',
      linkText: 'Lue lisää',
      linkUrl: 'https://kummilapset.hel.fi/fi/ajankohtaista/',
      __typename: 'Notification',
    },
  },
} as const;

export const notificationMock: MockedResponse = {
  request: {
    query: notificationQuery,
    variables: { language: 'fi' },
  },
  result: notificationQueryResponse,
};
