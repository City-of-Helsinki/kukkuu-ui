import { ReactElement } from 'react';
import { render, RenderOptions, screen } from '@testing-library/react';
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
  // eslint-disable-next-line testing-library/no-node-access
  return buttonLabel.closest('button') as HTMLElement;
};

export const selectHdsButtonByText = (text: string): HTMLElement =>
  selectHdsButton(screen.getByText(text));

export const selectAllHdsButtonByText = (text: string): HTMLElement =>
  selectHdsButton(screen.getAllByText(text)[0]);

// re-export everything
// eslint-disable-next-line import/export
export * from '@testing-library/react';

// override render method
// eslint-disable-next-line import/export
export { customRender as render };
