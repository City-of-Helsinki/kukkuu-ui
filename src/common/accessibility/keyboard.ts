import React from 'react';

// This file is used to store keyboard related functionality for accessibility purposes
// https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values

// Keys that are used to simulate a click event using the keyboard
export const a11nClickKeys = [
  'Enter',
  'Spacebar', // Older browsers may return "Spacebar" instead of " "
  ' ', // Spacebar
];

export type HandleOnClick = (() => void) | undefined;

export function a11nHandleKeyPress(handleOnClick: HandleOnClick) {
  return function (event: React.KeyboardEvent<HTMLElement>) {
    if (handleOnClick && a11nClickKeys.includes(event.key)) {
      handleOnClick();
    }
  };
}
