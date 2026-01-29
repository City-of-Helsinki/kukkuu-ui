import { LanguagesDocument } from '@city-of-helsinki/react-helsinki-headless-cms/apollo';
import { MockedResponse } from '@apollo/client/testing';

import { HARDCODED_CMS_LANGUAGE_QUERY_RESPONSE } from '../../../languages/constants';

export const languagesMock: MockedResponse = {
  request: {
    query: LanguagesDocument,
  },
  result: { ...HARDCODED_CMS_LANGUAGE_QUERY_RESPONSE },
};
