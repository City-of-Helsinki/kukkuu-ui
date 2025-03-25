import { MockedResponse } from '@apollo/client/testing';
import { graphql, HttpResponse } from 'msw';

import { customRender as render } from '../../../common/test/customRender';
import Layout from '../Layout';
import { footerMenuMock } from '../footer/__mocks__/footerMenuMock';
import { languagesMock } from '../footer/__mocks__/languagesMock';
import { headerMenuMock } from '../navigation/__mocks__/headerMenuMock';
import { notificationMock } from '../notification/__mocks__/notificationMock';
import { server } from '../../../test/msw/server';
import AppConfig from '../AppConfig';
import pageQueryResponse from './__mocks__/pageQueryResponse';

const mocks: MockedResponse[] = [
  footerMenuMock,
  headerMenuMock,
  languagesMock,
  notificationMock,
];

beforeEach(() => {
  const headlessCms = graphql.link(AppConfig.cmsUri);
  server.use(
    headlessCms.query('page', () => HttpResponse.json({ ...pageQueryResponse }))
  );
});

it('renders without crashing', () => {
  const { container } = render(<Layout />, mocks, undefined, 'MemoryRouter');
  expect(container).toMatchSnapshot();
});
