import { MockedResponse } from '@apollo/client/testing';

import { customRender as render } from '../../../common/test/customRender';
import EventIsEnrolled from '../EventIsEnrolled';
import occurrenceQuery from '../queries/occurrenceQuery';

const emptyOccurrenceMock: MockedResponse = {
  request: {
    query: occurrenceQuery,
    variables: { id: undefined, childId: undefined },
  },
  result: {
    data: {
      occurrence: {},
    },
  },
};

const mocks: MockedResponse[] = [emptyOccurrenceMock];

it('renders snapshot correctly', () => {
  const { container } = render(<EventIsEnrolled />, mocks);
  expect(container).toMatchSnapshot();
});
