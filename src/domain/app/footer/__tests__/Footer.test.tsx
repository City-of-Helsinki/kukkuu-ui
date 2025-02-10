import * as React from 'react';
import { MockedResponse } from '@apollo/client/testing';
import { vi } from 'vitest';
import { screen } from '@testing-library/react';

import Footer from '../Footer';
import { customRender as render } from '../../../../common/test/customRender';
import { footerMenuMock } from '../__mocks__/footerMenuMock';
import { languagesMock } from '../__mocks__/languagesMock';

vi.mock('hds-react', async () => {
  const actual = await vi.importActual('hds-react');
  return {
    ...actual,
    logoFi: 'mocked hds-react logoFi',
  };
});

const mocks: MockedResponse[] = [{ ...footerMenuMock }, { ...languagesMock }];

it('Footer matches snapshot', async () => {
  render(<Footer />, mocks);
  await screen.findByText('Saavutettavuusseloste');
  const footerElement = screen.getByRole('contentinfo');
  expect(footerElement).toMatchSnapshot();
});
