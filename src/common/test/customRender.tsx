import type { ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import type { MockedResponse } from '@apollo/client/testing';

import TestProviders from './TestProviders';

export const customRender = (
  ui: ReactElement,
  mocks?: MockedResponse[],
  options?: RenderOptions
) =>
  render(ui, {
    wrapper: ({ children }) => (
      <TestProviders mocks={mocks}>{children}</TestProviders>
    ),
    ...options,
  });
