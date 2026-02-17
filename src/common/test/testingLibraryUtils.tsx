import { screen } from '@testing-library/react';

export const selectHdsButton = (buttonLabel: HTMLElement): HTMLElement => {
  return buttonLabel.closest('button') as HTMLElement;
};

export const selectHdsButtonByText = (text: string): HTMLElement =>
  selectHdsButton(screen.getByText(text));

export const selectAllHdsButtonByText = (text: string): HTMLElement =>
  selectHdsButton(screen.getAllByText(text)[0]);
