import React, { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { MockedResponse } from '@apollo/client/testing';

import TestProviders from './TestProviders';

const customRender = (
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

export const selectHdsButton = (buttonLabel: HTMLElement): HTMLElement => {
  return buttonLabel.closest('button') as HTMLElement;
};

export const selectHdsButtonByText = (
  render: RenderResult,
  text: string
): HTMLElement => {
  const { getByText } = render;

  return selectHdsButton(getByText(text));
};

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };