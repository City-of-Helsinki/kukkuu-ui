import * as React from 'react';
import { MockedResponse } from '@apollo/client/testing';
import { vi } from 'vitest';

import Footer from '../Footer';
import { render, screen } from '../../../../common/test/testingLibraryUtils';
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
  const { container } = render(<Footer />, mocks);
  await screen.findByText('Saavutettavuusseloste');
  expect(container.firstChild).toMatchSnapshot();
});
