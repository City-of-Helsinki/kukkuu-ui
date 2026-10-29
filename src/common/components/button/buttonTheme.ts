import { ButtonTheme } from 'hds-react';

/**
 * @deprecated All buttons use black themed HDS buttons instead of yellow.
 */
export const yellowButtonTheme: ButtonTheme = {
  '--background-color': 'var(--color-summer)',
  '--background-color-hover': 'var(--color-summer-dark)',
  '--background-color-focus': 'var(--color-summer)',
  '--background-color-active': 'var(--color-summer-dark)',
  '--border-color': 'var(--color-summer)',
  '--border-color-hover': 'var(--color-summer-dark)',
  '--border-color-focus': 'var(--color-summer-dark)',
  '--border-color-active': 'var(--color-summer-dark)',
  '--color': 'var(--color-black)',
  '--color-hover': 'var(--color-black)',
  '--color-focus': 'var(--color-black-90)',
  '--color-active': 'var(--color-black-90)',
  '--outline-color-focus': 'var(--color-coat-of-arms)',
};

export const dropdownButtonTheme: ButtonTheme = {
  '--color': 'var(--color-black-90)',
  '--color-hover': 'var(--color-white)',
  '--color-focus': 'var(--color-white)',
  '--color-active': 'var(--color-white)',
  '--background-color': 'var(--color-white)',
  '--background-color-hover': 'var(--color-bus)',
  '--background-color-focus': 'var(--color-bus)',
  '--background-color-active': 'var(--color-bus)',
  '--border-color': 'transparent',
};
