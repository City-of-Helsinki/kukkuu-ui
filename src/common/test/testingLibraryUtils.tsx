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

export const selectAllHdsButtonByText = (
  render: RenderResult,
  text: string
): HTMLElement => {
  const { getAllByText } = render;

  return selectHdsButton(getAllByText(text)[0]);
};

// re-export everything
// eslint-disable-next-line import/export
export * from '@testing-library/react';

// override render method
// eslint-disable-next-line import/export
export { customRender as render };
