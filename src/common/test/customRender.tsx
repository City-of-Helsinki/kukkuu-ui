import type { ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import type { MockedResponse } from '@apollo/client/testing';

import type { RouterType } from './types';
import TestProviders from './TestProviders';

export const customRender = (
  ui: ReactElement,
  mocks?: MockedResponse[],
  options?: RenderOptions,
  router?: RouterType
) =>
  render(ui, {
    wrapper: ({ children }) => (
      <TestProviders mocks={mocks} router={router}>
        {children}
      </TestProviders>
    ),
    ...options,
  });
